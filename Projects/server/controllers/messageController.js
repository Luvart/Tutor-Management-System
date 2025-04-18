const { get } = require("http");
const db = require("../db");
const multer = require("multer");
const path = require("path");
const util = require("util");

// Set up storage for uploaded images
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage }).single("image");
const uploadAsync = util.promisify(upload);
const queryAsync = util.promisify(db.query).bind(db);

// Send Message (Text + Image)
exports.sendMessage = async (req, res) => {
    try {
        // Wait for file upload
        await uploadAsync(req, res);

        const { sender_id, receiver_id, message } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        await queryAsync(
            "INSERT INTO messages (sender_id, receiver_id, message, image_url) VALUES (?, ?, ?, ?)",
            [sender_id, receiver_id, message, image_url]
        );

        res.status(200).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Fetch Messages
exports.getMessages = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const messages = await queryAsync(
            `SELECT 
                    m.id, m.sender_id, m.receiver_id, m.message, m.image_url, 
                    CONCAT(s.lastname, ', ', s.firstname, ' ', IFNULL(s.middlename, '')) AS sender_name,
                    CONCAT(r.lastname, ', ', r.firstname, ' ', IFNULL(r.middlename, '')) AS receiver_name,
                    m.created_at
                FROM messages m
                JOIN users s ON m.sender_id = s.id
                JOIN users r ON m.receiver_id = r.id
                WHERE m.sender_id = ? OR m.receiver_id = ?
                ORDER BY m.id ASC;`,
            [user_id, user_id]
        );

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getUnreadCounts = async (req, res) => {
    try {
        // Get admin_id from request params
        const admin_id = req.params.admin_id; 
        if (!admin_id) {
            return res.status(400).json({ error: "Admin ID is required" });
        }

        // Use `params` directly in the SQL query
        const query = `
            SELECT sender_id, COUNT(*) AS unread_count
            FROM messages
            WHERE receiver_id = ? AND is_read = 0
            GROUP BY sender_id;
        `;

        // Use db.query() for querying directly
        db.query(query, [admin_id], (err, rows) => {
            if (err) {
                console.error("Error in query execution:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            // Check if rows were returned
            if (rows.length === 0) {
                return res.status(200).json({ unread_counts: {} }); // No unread messages
            }

            // Create the unreadCounts object
            const unreadCounts = {};
            rows.forEach(row => {
                unreadCounts[row.sender_id] = row.unread_count;
            });

            // Send back the unread counts as a response
            res.json({ unread_counts: unreadCounts });
        });
    } catch (error) {
        console.error("Error fetching unread messages:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.markMessagesAsRead = async (req, res) => {
    try {
        const { user_id } = req.params; // Extract user_id from route parameters

        if (!user_id) {
            return res.status(400).json({ message: "user_id is required" });
        }

        // Assuming receiver_id is always the admin_id (update this dynamically if needed)
        const receiver_id = 2;  // Set admin's user_id here, or retrieve from session/context

        const query = `
            UPDATE messages 
            SET is_read = 1 
            WHERE sender_id = ? AND receiver_id = ? AND is_read = 0
        `;

        const [result] = await db.promise().query(query, [user_id, receiver_id]); // Use .promise().query()

        res.status(200).json({ success: true, message: "Messages marked as read", affectedRows: result.affectedRows });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ error: "Error marking messages as read" });
    }
};


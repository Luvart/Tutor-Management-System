const db = require("../db");

// Get all attendance records
exports.getAllSessions = (req, res) => {
  const query = `
    SELECT attendance.*, customers.name AS customer_name, courses.name AS course_name
    FROM attendance
    JOIN customers ON attendance.customer_id = customers.id
    JOIN courses ON attendance.course_id = courses.id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

// Create a session record
exports.createSession = (req, res) => {
  const { booking_id, customer_id, package_bookingId } = req.body;

  // Validate required fields
  if (!booking_id || !customer_id || !package_bookingId) {
    return res.status(400).json({ error: "Booking ID and Customer ID are required." });
  }

  // Insert the session record into the sessions table
  const query = `
    INSERT INTO sessions (package_bookingId, booking_id, customer_id, created_at)
    VALUES (?, ?, ?, NOW());
  `;

  db.query(query, [package_bookingId, booking_id, customer_id], (err, result) => {
    if (err) {
      console.error("Error creating session:", err);
      return res.status(500).json({ error: "Failed to create session." });
    }

    res.status(201).json({ message: "Session created successfully!", sessionId: result.insertId });
  });
};

// Update an attendance record
exports.updateSessionStatus = (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  const query = "UPDATE sessions SET status = ? WHERE booking_id = ?";
  db.query(query, [status, bookingId], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send("Attendance record updated successfully!");
  });
};

// Delete an attendance record
exports.deleteSession = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM attendance WHERE id = ?";

  db.query(query, [id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send("Attendance record deleted successfully!");
  });
};

// Update a package's status based on session completion
exports.updateStatusBooking = (req, res) => {
  const { status } = req.body;

  // Step 1: Check confirmed sessions vs session count
  const checkQuery = `
      SELECT 
          p.id AS packageId, 
          COUNT(CASE WHEN s.status = 'Confirmed' THEN 1 END) AS confirmed_sessions,
          p.session_count
      FROM sessions s
      JOIN package_booking pb ON pb.id = s.package_bookingId
      JOIN packages p ON p.id = pb.package_id
      GROUP BY s.package_bookingId, p.session_count
      HAVING COUNT(CASE WHEN s.status = 'Confirmed' THEN 1 END) >= p.session_count;
  `;

  db.query(checkQuery, (err, results) => {
      if (err) {
          console.error("Error fetching session count:", err);
          return res.status(500).send("Error fetching session count.");
      }

      if (results.length === 0) {
         // ✅ Instead of returning an error, return a 204 No Content response
         return res.status(204).send(); 
      }

      // Step 2: Update package status for matched packageIds
      const packageIds = results.map(row => row.packageId);

      const updateQuery = `UPDATE packages SET status = ? WHERE id IN (?)`;
      db.query(updateQuery, [status, packageIds], (updateErr) => {
          if (updateErr) {
              console.error("Error updating package status:", updateErr);
              return res.status(500).send("Error updating package status.");
          }
          res.status(200).send("Package status updated successfully!");
      });
  });
};

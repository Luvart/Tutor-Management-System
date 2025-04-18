const db = require("../db");

// Create a payment record
exports.createPayments = (req, res) => {
    const { packagebooking_id, amount_paid } = req.body;
    const query = "INSERT INTO payments (packagebooking_id, amount_paid) VALUES (?, ?)";

    db.query(query, [packagebooking_id, amount_paid], (err) => {
        if (err) {
            console.error("Error creating payment record:", err); // Log the error for debugging
            return res.status(500).json({ error: "Failed to create payment record." }); // Generic error message
        }
        res.status(201).json({ message: "Payment record created successfully!" });
    });
};

exports.getRatings = (req, res) => {
    const { start_date, end_date, tutor_id, package_id } = req.query;

    const query = `
        SELECT 
            p.name AS package_name,
            p.section,
            CONCAT(st.lastname, ', ', st.firstname, ' ', COALESCE(st.middlename, '')) AS student_name,
            CONCAT(t.lastname, ', ', t.firstname, ' ', COALESCE(t.middlename, '')) AS tutor_name,
            f.rating,
            f.comments,
            DATE_FORMAT(f.created_at, '%Y-%m-%d') AS date,
            s.session_number,
            p.session_count
        FROM feedback f
        INNER JOIN bookings b ON b.id = f.booking_id
        INNER JOIN schedules s ON b.schedule_id = s.id
        INNER JOIN packages p ON s.package_id = p.id
        INNER JOIN users t ON p.tutor_id = t.id
        INNER JOIN users st ON b.student_id = st.id
        WHERE f.created_at BETWEEN ? AND ?
        ${tutor_id ? "AND t.id = ?" : ""} 
        ${package_id ? "AND p.id = ?" : ""};
    `;

    const avgQuery = `
        SELECT 
            AVG(f.rating) AS average_rating,
            p.session_count
        FROM feedback f
        INNER JOIN bookings b ON b.id = f.booking_id
        INNER JOIN schedules s ON b.schedule_id = s.id
        INNER JOIN packages p ON s.package_id = p.id
        INNER JOIN users t ON p.tutor_id = t.id
        INNER JOIN users st ON b.student_id = st.id
        WHERE f.created_at BETWEEN ? AND ?
        ${tutor_id ? "AND t.id = ?" : ""} 
        ${package_id ? "AND p.id = ?" : ""};
    `;

    // Build query parameters dynamically
    const queryParams = [start_date, end_date];
    if (tutor_id) queryParams.push(tutor_id);
    if (package_id) queryParams.push(package_id);

    // Execute both queries
    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error("Error fetching ratings:", err);
            return res.status(500).json({ error: "Failed to fetch ratings." });
        }

        db.query(avgQuery, queryParams, (avgErr, avgResults) => {
            if (avgErr) {
                console.error("Error fetching average rating:", avgErr);
                return res.status(500).json({ error: "Failed to fetch average rating." });
            }

            const averageRating = avgResults[0]?.average_rating || 0; // Default to 0 if no ratings
            res.json({ ratings: results, average_rating: averageRating });
        });
    });
};

// Get Income Report
exports.getIncome = (req, res) => {
    const { start_date, end_date, pb_id } = req.query;

    const query = `
        SELECT 
            pb.package_id,
            p.name,
            p.price AS total_price,
            COALESCE(SUM(py.amount_paid), 0) AS amount_received,
            (p.price - COALESCE(SUM(py.amount_paid), 0)) AS amount_not_received,
            py.payment_date
        FROM package_booking pb
		JOIN payments py ON py.packagebooking_id = pb.id
		JOIN packages p ON p.id = pb.package_id
		WHERE py.payment_date BETWEEN ? AND ?
        ${pb_id ? "AND py.packagebooking_id = ?" : ""}
		GROUP BY py.package_id, p.name, p.price;`

    db.query(query, [start_date, end_date, pb_id], (err, results) => {
        if (err) {
            console.error("Error fetching income:", err);
            return res.status(500).json({ error: "Failed to fetch income." });
        }
        res.json(results);
    });
};

// Get Income Report
exports.getStudentPayables = (req, res) => {
    const { studentId } = req.params;

    const query = `
        SELECT
            pb.id, 
            pb.package_id,
            u.id,
            CONCAT(u.lastname, ', ', u.firstname, ' ', COALESCE(u.middlename, '')) AS student_name,
            p.name,
            p.price AS total_price,
            py.amount_paid,
            py.payment_date
        FROM package_booking pb
        JOIN packages p ON p.id = pb.package_id
        JOIN payments py ON py.packagebooking_id = pb.id
        JOIN users u ON u.id = pb.customer_id
        WHERE u.id = ?;`    

    db.query(query, [studentId], (err, results) => {
        if (err) {
            console.error("Error fetching income:", err);
            return res.status(500).json({ error: "Failed to fetch income." });
        }
        res.json(results);
    });
};


// Get all tutors
exports.getAllTutors = (req, res) => {
  const query = `
    SELECT
      p.id as package_id,
      CONCAT(t.lastname, ', ',t.firstname, ' ', COALESCE(t.middlename, '')) AS tutor_name,
      p.name as package_name,
      p.section,
      t.id as tutor_id
    FROM users t
    JOIN packages p ON p.tutor_id = t.id
    WHERE role = 'Tutor';`
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};
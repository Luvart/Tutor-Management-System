const db = require("../db");

// Get tutor schedules by ID 
exports.getTutorSchedules = (req, res) => {
  const { tutorId } = req.params;

  if (!tutorId) {
    return res.status(400).json({ error: "Tutor ID is required." });
  }

  const query = 
        `SELECT 
          p.id AS package_id,
          s.id AS sched_id,
          p.name AS package_name,
          p.tutor_id,
          u.id AS tutor_id,
          CONCAT(u.lastname, ', ', u.firstname, ' ', COALESCE(u.middlename, '')) AS tutor_name
        FROM 
          packages p
        INNER JOIN 
          schedules s ON p.id = s.package_id
        INNER JOIN 
          users u ON p.tutor_id = u.id

        WHERE 
          p.tutor_id = ?`;
  const params = [tutorId];


  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Error fetching schedules from database." });
    }
    res.status(200).json(results);
  });
};

// Get submission of bookings
exports.fetchBookingSubmission = (req, res) => {

  const query = 
        `SELECT
            b.id AS booking_id, 
            b.status,
            b.description,
            b.sessionNumber,
            p.id AS package_id,
            p.name AS package_name,
            t.id AS tutor_id,
            CONCAT(t.lastname, ', ', t.firstname, ' ', IFNULL(t.middlename, '')) AS tutor_name,
            s.id AS schedule_id,
            s.date,
            s.start_time,
            s.end_time,
            c.id AS client_id,
            CONCAT(c.lastname, ', ', c.firstname, ' ', IFNULL(c.middlename, '')) AS client_name
        FROM 
            packages p
        INNER JOIN schedules s ON p.id = s.package_id
        INNER JOIN bookings b ON b.schedule_id = s.id
        INNER JOIN users t ON p.tutor_id = t.id
        INNER JOIN users c ON c.id = b.student_id;
`;

  // const query =`SELECT * from bookings WHERE status = 'Pending'`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Error fetching bookings from database." });
    }
    res.status(200).json(results);
  });
};

// Fetch booking submissions for a specific package
exports.fetchBookingSubmissionsByPackage = (req, res) => {
  const { packageId } = req.params;

  if (!packageId) {
    return res.status(400).json({ error: "Package ID is required." });
  }

  const query = `
    SELECT 
    b.id AS booking_id,
    pb.id AS packageBookingId,
    b.student_id as customer_id,
    p.name AS package_name,
    CONCAT(t.lastname, ', ', t.firstname, ' ', COALESCE(t.middlename, '')) AS tutor_name,
    s.date,
    s.start_time,
    s.end_time,
    CONCAT(c.lastname, ', ', c.firstname, ' ', COALESCE(c.middlename, '')) AS client_name,
    b.description,
    b.status,
    s.session_number,
    pb.session_credits - COALESCE(
        (SELECT COUNT(*) 
         FROM bookings b2
         JOIN schedules s2 ON b2.schedule_id = s2.id
         WHERE b2.student_id = c.id 
         AND s2.package_id = p.id 
         AND b2.status = 'Approved'), 
        0
    ) AS remainingCredits
FROM bookings b
JOIN schedules s ON b.schedule_id = s.id
JOIN packages p ON s.package_id = p.id
JOIN users t ON p.tutor_id = t.id
JOIN users c ON b.student_id = c.id
JOIN package_booking pb ON pb.customer_id = c.id AND pb.package_id = p.id
WHERE p.id = ?
ORDER BY FIELD(b.status, 'Approved', 'Pending', 'Rejected'), s.date, s.start_time;
  `;

  db.query(query, [packageId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Error fetching booking data" });
    }

    res.status(200).json(results);
  });
};

// Get submission of bookings
exports.fetchBookingSubmissionByUser = (req, res) => {
  const  userId  = req.params.userId; // Correctly extract userId

  const query = `
        SELECT
            b.id AS booking_id, 
            b.status,
            b.description,
            p.id AS package_id,
            p.name AS package_name,
            t.id AS tutor_id,
            CONCAT(t.lastname, ', ', t.firstname, ' ', IFNULL(t.middlename, '')) AS tutor_name,
            s.id AS schedule_id,
            s.date,
            s.start_time,
            s.end_time,
            c.id AS client_id,
            CONCAT(c.lastname, ', ', c.firstname, ' ', IFNULL(c.middlename, '')) AS client_name
        FROM 
            packages p
        INNER JOIN schedules s ON p.id = s.package_id
        INNER JOIN bookings b ON b.schedule_id = s.id
        INNER JOIN users t ON p.tutor_id = t.id
        INNER JOIN users c ON c.id = b.student_id
        WHERE 
            c.id = ?;`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Error fetching bookings from database." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user." });
    }

    res.status(200).json(results);
  });
};



// Create a new booking
exports.createBooking = (req, res) => {
  const { scheduleId, studentId, description } = req.body;

  if (!scheduleId || !studentId) {
    return res.status(400).send("Schedule ID and Student ID are required.");
  }

  const query = "INSERT INTO bookings (schedule_id, student_id, description) VALUES (?, ?, ?)";
  db.query(query, [scheduleId, studentId, description || null], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to create booking.");
    }
    res.status(201).send("Booking created successfully!");
  });
};


// Fetch all bookings
exports.getApprovedBookings = (req, res) => {
  const query = `
    SELECT b.* 
      FROM bookings b 
      JOIN schedules s ON s.id = b.schedule_id
      JOIN packages p ON p.id = s.package_id
      WHERE b.status = "Approved" AND p.status = "Booked";
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to fetch bookings.");
    }
    res.status(200).json(results);
  });
};

// Fetch all bookings for manage sessions
exports.getApprovedBookingsForSessions = (req, res) => {
  const query = `
    SELECT 
          b.id,
          p.name AS package_name,
          p.section,
          CONCAT(t.lastname, ', ', t.firstname, ' ', COALESCE(t.middlename, '')) AS tutor_name,
          CONCAT(st.lastname, ', ', st.firstname, ' ', COALESCE(st.middlename, '')) AS student_name,
          s.date,
          s.start_time,
          s.end_time,
          s.session_number AS sessionNumber,
          b.status AS bookingStatus,
          ss.status AS sessionStatus
      FROM bookings b
      JOIN schedules s ON b.schedule_id = s.id
      JOIN packages p ON s.package_id = p.id
      JOIN users t ON p.tutor_id = t.id
      JOIN users st ON b.student_id = st.id
      JOIN sessions ss ON ss.booking_id = b.id
      WHERE b.status = "Approved"
      ORDER BY s.session_number ASC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to fetch bookings.");
    }
    res.status(200).json(results);
  });
};

// Fetch all bookings for manage sessions
exports.getApprovedBookingsForSessionsperStudent = (req, res) => {

  const  studentId  = req.params.studentId; // Correctly extract userId

  const query = `
    SELECT 
          b.id,
          b.student_id,
          p.name AS package_name,
          p.section,
          CONCAT(t.lastname, ', ', t.firstname, ' ', COALESCE(t.middlename, '')) AS tutor_name,
          s.date,
          s.start_time,
          s.end_time,
          s.session_number AS sessionNumber,
          b.status AS bookingStatus,
          ss.status AS sessionStatus
      FROM bookings b
      JOIN sessions ss ON ss.booking_id = b.id
      JOIN schedules s ON b.schedule_id = s.id
      JOIN packages p ON s.package_id = p.id
      JOIN users t ON p.tutor_id = t.id
      WHERE b.status = "Approved" AND b.student_id = ?
      ORDER BY s.session_number ASC;
  `;

  db.query(query, [studentId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to fetch bookings.");
    }
    res.status(200).json(results);
  });
};

// Fetch all bookings for manage sessions
exports.getApprovedBookingsForSessionsperTutor = (req, res) => {

  const  { tutorId }  = req.params; // Correctly extract userId

  const query = `
    SELECT 
          b.id,
          p.name AS package_name,
          p.section,
          CONCAT(t.lastname, ', ', t.firstname, ' ', COALESCE(t.middlename, '')) AS tutor_name,
          s.date,
          s.start_time,
          s.end_time,
          s.session_number AS sessionNumber,
          b.status AS bookingStatus,
          ss.status AS sessionStatus
      FROM bookings b
      JOIN schedules s ON b.schedule_id = s.id
      JOIN packages p ON s.package_id = p.id
      JOIN users t ON p.tutor_id = t.id
      JOIN sessions ss ON ss.booking_id = b.id
      WHERE b.status = "Approved" AND t.id = ?
      ORDER BY s.session_number ASC;`

  db.query(query, [tutorId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to fetch bookings.");
    }
    res.status(200).json(results);
  });
};

// Record a session
exports.recordSession = (req, res) => {
  const bookingId = req.params.id;

  const query = "UPDATE bookings SET session_consumed = session_consumed + 1 WHERE id = ? AND session_consumed < (SELECT session_count FROM packages WHERE packages.id = bookings.package_id)";
  db.query(query, [bookingId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to record session.");
    }

    if (result.affectedRows === 0) {
      return res.status(400).send("Session limit already reached or booking not found.");
    }

    res.status(200).send("Session recorded successfully!");
  });
};

// Update booking status and session number
exports.updateBookingStatus = (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

    const updateQuery = `
      UPDATE bookings
      SET status = ?, updated_at = NOW()
      WHERE id = ?;
    `;

    db.query(updateQuery, [status, bookingId], (err, result) => {
      if (err) {
        console.error("Database update error:", err);
        return res.status(500).json({ error: "Error updating booking status" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Booking not found" });
      }

      res.status(200).json({ message: "Booking status updated successfully"});
    });
  };
  
// Client
exports.fetchScheduleBooking = (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT 
        pb.id,
        pb.customer_id,
        pb.package_id, 
        p.name, 
        p.tutor_id,
        p.session_count,
        p.section,
        pb.status AS paymentStatus,
        COUNT(DISTINCT CASE WHEN bs.status = 'approved' THEN bs.schedule_id END) AS bookedSessions,
        (pb.session_credits - COUNT(DISTINCT CASE WHEN bs.status = 'approved' THEN bs.schedule_id END)) AS remainingCredits
    FROM package_booking pb
    JOIN packages p ON p.id = pb.package_id 
    LEFT JOIN bookings bs
        ON bs.student_id = pb.customer_id
        AND bs.schedule_id IN (SELECT s.id FROM schedules s WHERE s.package_id = pb.package_id)
    WHERE pb.customer_id = ?
      AND pb.status IN ('Fully Paid', 'Partially Paid')
    GROUP BY pb.id, pb.customer_id, p.tutor_id, pb.status, pb.session_credits;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching package bookings:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No valid packages found for this user." });
    }

    res.json(results);
  });
};

// Get pending bookings
exports.fetchPendingBooking = (req, res) => {

  const query =`SELECT * from bookings WHERE status = 'Pending'`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Error fetching bookings from database." });
    }
    res.status(200).json(results);
  });
};


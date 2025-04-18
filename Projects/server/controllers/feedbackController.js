const db = require("../db");

// Get all attendance records
exports.getAllFeedbacks = (req, res) => {
  const query = `
    SELECT * from feedback
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

// Get all attendance records
exports.fetchFeedbackByStudent = (req, res) => {
  const { studentId } = req.params;

  const query = `
    SELECT f.*, b.student_id  FROM feedback f
    JOIN bookings b ON b.id = f.booking_id
    WHERE b.student_id = ?
  `;
  db.query(query,[studentId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

// Create an attendance record
exports.createFeedback = (req, res) => {
  const { bookingId } = req.params;
  const { rating, comments } = req.body;
  const query = "INSERT INTO feedback (booking_id, rating, comments) VALUES (?, ?, ?)";

  db.query(query, [bookingId, rating, comments], (err) => {
    if (err) return res.status(500).send(err);
    res.status(201).send("Rating submitted successfully!");
  });
};

// Update an attendance record
exports.updateFeedback = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE attendance SET status = ? WHERE id = ?";
  db.query(query, [status, id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send("Attendance record updated successfully!");
  });
};

// Delete an attendance record
exports.deleteFeedback = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM attendance WHERE id = ?";

  db.query(query, [id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send("Attendance record deleted successfully!");
  });
};

const db = require("../db");

// Get all attendance records
exports.getAllAttendanceRecords = (req, res) => {
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

// Create an attendance record
exports.createAttendanceRecord = (req, res) => {
  const { customer_id, course_id, attendance_date, status } = req.body;
  const query = "INSERT INTO attendance (customer_id, course_id, attendance_date, status) VALUES (?, ?, ?, ?)";

  db.query(query, [customer_id, course_id, attendance_date, status], (err) => {
    if (err) return res.status(500).send(err);
    res.status(201).send("Attendance record created successfully!");
  });
};

// Update an attendance record
exports.updateAttendanceRecord = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = "UPDATE attendance SET status = ? WHERE id = ?";
  db.query(query, [status, id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send("Attendance record updated successfully!");
  });
};

// Delete an attendance record
exports.deleteAttendanceRecord = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM attendance WHERE id = ?";

  db.query(query, [id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send("Attendance record deleted successfully!");
  });
};

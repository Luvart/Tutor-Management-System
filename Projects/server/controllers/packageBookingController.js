const db = require("../db");

// Get all packages
exports.getAllPackageBooking = (req, res) => {
  const query = 
    `SELECT 
        pb.*, p.price FROM package_booking pb
        JOIN packages p ON pb.package_id = p.id
    `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

// Get all packages
exports.getActivePackageBooking = (req, res) => {
    const query = 
      `SELECT
          pb.*, 
          p.price, p.name AS package_name, p.section, p.tutor_id, p.status,
          CONCAT(t.lastname, ', ',t.firstname, ' ', COALESCE(t.middlename, '')) AS tutor_name
          FROM package_booking pb
          JOIN packages p ON pb.package_id = p.id
          JOIN users t ON t.id = p.tutor_id
          WHERE p.status = "Booked"
      `;
    db.query(query, (err, results) => {
      if (err) return res.status(500).send(err);
      res.status(200).json(results);
    });
  };

// Get package bookng by tutor
exports.getPackagebookingbyTutor = (req, res) => {
    const { tutorId } = req.params;

    const query = 
        `SELECT 
            pb.*, p.id 
            FROM package_booking pb
            JOIN packages p ON pb.package_id = p.id
            WHERE p.tutor_id = ?`;
    db.query(query, [tutorId], (err, results) => {
      if (err) return res.status(500).send(err);
      res.status(200).json(results);
    });
  };

exports.checkBookingStatus = (req, res) => {
    const studentId = req.query.studentId;  // Get the customer ID from query parameters

    if (!studentId) {
        return res.status(400).json({ message: "Customer ID is required" });
    }

    const query = `
        SELECT pb.id, p.id AS packageId,  pb.customer_id, p.status FROM package_booking pb
            JOIN users u ON u.id = pb.customer_id
            JOIN packages p ON p.id = pb.package_id
            WHERE u.id = ? AND p.status = "Booked" 
    `;

    // Execute the query to get the packages that are booked by the customer
    db.query(query, [studentId], (error, results) => {
        if (error) {
            console.error("Error fetching packages:", error);
            return res.status(500).json({ error: "Error fetching packages" });
        }

        // If no packages are found, return an empty array
        if (results.length === 0) {
            return res.status(200).json([]);
        }

        // If packages are found, send them as a response
        return res.status(200).json(results);
    });
};

exports.checkFullyPaidStatus = async (req, res) => {
  const { studentId } = req.params;

  try {
      const query = `
          SELECT 
              pb.package_id,
              pb.customer_id,
              pb.status
          FROM package_booking pb
          JOIN users u ON u.id = pb.customer_id
          WHERE pb.status NOT IN ('Fully Paid') AND u.id = ?
      `;
      const [results] = await db.promise().query(query, [studentId]);

      // If there are no results, the user has no unpaid packages
      const hasUnpaidPackages = results.length > 0;
      res.status(200).json({ hasUnpaidPackages });
  } catch (error) {
      console.error("Error checking fully paid status:", error);
      res.status(500).json({ message: "Error checking fully paid status." });
  }
};

exports.createPackageBooking = (req, res) => {
    const { studentId, package_id } = req.body;

    if (!studentId || !package_id) {
        return res.status(400).json({ message: "Customer ID and Package ID are required" });
    }

    const query = `
        INSERT INTO package_booking (customer_id, package_id, status, created_at)
        VALUES (?, ?, 'Pending', NOW())
    `;

    db.query(query, [studentId, package_id], (err, result) => {
        if (err) {
            console.error("Error booking package:", err);
            return res.status(500).json({ message: "Failed to book package" });
        }
        res.status(201).json({ 
            message: "Package booked successfully", 
            bookingId: result.insertId 
        });
    });
};

// Approve Booking and Update Session Credits
exports.approveBooking = (req, res) => {
    const { status, session_credits } = req.body;
    const bookingId = req.params.id;

    // Fetch the booking details
    const query = "SELECT * FROM package_booking WHERE id = ?";
    db.query(query, [bookingId], (err, booking) => {
        if (err) return res.status(500).send(err);
        if (!booking.length) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const packageId = booking[0].package_id;

        // Approve the selected booking
        const updateBookingQuery = "UPDATE package_booking SET status = ?, session_credits = ? WHERE id = ?";
        db.query(updateBookingQuery, [status, session_credits, bookingId], (err) => {
            if (err) return res.status(500).send(err);
            res.status(200).json({ message: "Booking approved successfully" });

            // // Reject other bookings for the same package (if only one approval is allowed)
            // const rejectOtherBookingsQuery = "UPDATE package_booking SET status = 'Rejected' WHERE package_id = ? AND id != ? AND status != 'Rejected'";
            // db.query(rejectOtherBookingsQuery, [packageId, bookingId], (err) => {
            //     if (err) return res.status(500).send(err);
            //     res.status(200).json({ message: "Booking approved successfully, other bookings rejected" });
            // });
        });
    });
};

// Reject Booking
exports.rejectBooking = (req, res) => {
    const bookingId = req.params.id;

    // Fetch the booking details
    const query = "SELECT * FROM package_booking WHERE id = ?";
    db.query(query, [bookingId], (err, booking) => {
        if (err) return res.status(500).send(err);
        if (!booking.length) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Reject the selected booking
        const rejectQuery = "UPDATE package_booking SET status = 'Rejected' WHERE id = ?";
        db.query(rejectQuery, [bookingId], (err) => {
            if (err) return res.status(500).send(err);
            res.status(200).json({ message: "Booking rejected successfully" });
        });
    });
};

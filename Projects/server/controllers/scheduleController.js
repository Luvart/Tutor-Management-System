const db = require("../db");

// Get all schedules
exports.getAllSchedules = (req, res) => {
  const query = 
    `SELECT * from schedules
        
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

// Get all schedules
exports.getAllScheduleds = (req, res) => {
  const query = `SELECT s.* 
      FROM bookings b 
      JOIN schedules s ON s.id = b.schedule_id
      JOIN packages p ON p.id = s.package_id
      WHERE b.status = "Approved" AND p.status = "Booked"`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

// Get schedules per tutor
exports.getSchedulesPerTutor = (req, res) => {
  const { tutorId } = req.params;

  const query = `
      SELECT 
        s.*, p.tutor_id 
        FROM schedules s
        JOIN packages p ON p.id = s.package_id
        WHERE p.tutor_id = ? `;
  
        db.query(query, [tutorId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};



exports.getApprovedSchedules = (req, res) =>{
  const query = "SELECT * FROM schedules WHERE status = 'Approved'";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

// Get schedule by package
exports.getScheduleByPackage = (req, res) => {
  const { packageId } = req.params;

  const query = "SELECT * FROM schedules WHERE package_id = ?";

  db.query(query, [packageId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

// Get all tutors
exports.getAllTutors = (req, res) => {
  const query = "SELECT * FROM users WHERE role = 'Tutor'";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

exports.getTutorPackages = async (req, res) => {
    const query = `
      SELECT
        p.id, 
        t.lastname, 
        t.firstname, 
        t.middlename, 
        p.name AS package_name,
        p.section
      FROM users t
      JOIN packages p ON p.tutor_id = t.id
      ORDER BY t.lastname, t.firstname;
`;
    db.query(query, (err, results) => {
      if (err) return res.status(500).send(err);
      res.status(200).json(results);
    });
  };

  exports.getTutorPackagesbyTutor = async (req, res) => {
    const { id } = req.params;
    const query = `
      SELECT
        p.id, 
        t.lastname, 
        t.firstname, 
        t.middlename, 
        p.name AS package_name,
        p.section
      FROM users t
      JOIN packages p ON p.tutor_id = t.id
      WHERE p.status = 'Booked' AND p.tutor_id =?
      ORDER BY t.lastname, t.firstname;
`;
    db.query(query, [id], (err, results) => {
      if (err) return res.status(500).send(err);
      res.status(200).json(results);
    });
  };
    
// Create a schedule
exports.createSchedule = (req, res) => {
  const { package_id, date, start_time, end_time } = req.body;

  if (!package_id || !date || !start_time || !end_time) {
    return res.status(400).send("All required fields must be provided.");
  }

  // Fetch the maximum session count for the package
  const fetchMaxSessionsQuery = `
    SELECT p.session_count AS maxSessions
    FROM packages p
    WHERE p.id = ?;
  `;

  db.query(fetchMaxSessionsQuery, [package_id], (err, results) => {
    if (err) {
      console.error("Database fetch error:", err);
      return res.status(500).json({ error: "Error fetching package data" });
    }

    const maxSessions = results[0].maxSessions;

    // Fetch the current number of sessions for the package
    const fetchCurrentSessionsQuery = `
      SELECT COUNT(*) AS currentSessions
      FROM schedules
      WHERE package_id = ?;
    `;

    db.query(fetchCurrentSessionsQuery, [package_id], (err, results) => {
      if (err) {
        console.error("Database fetch error:", err);
        return res.status(500).json({ error: "Error fetching schedule data" });
      }

      const currentSessions = results[0].currentSessions || 0;

      if (currentSessions >= maxSessions) {
        return res.status(400).json({ error: "Maximum number of sessions reached for this package." });
      }

      // Check for overlapping schedules across all packages
      const checkOverlapQuery = `
        SELECT * 
        FROM schedules
        WHERE date = ? AND (
          (start_time < ? AND end_time > ?) OR
          (start_time < ? AND end_time > ?) OR
          (start_time >= ? AND end_time <= ?)
        );
      `;

      db.query(
        checkOverlapQuery,
        [date, end_time, start_time, start_time, end_time, start_time, end_time],
        (err, overlapResults) => {
          if (err) {
            console.error("Database overlap check error:", err);
            return res.status(500).json({ error: "Error checking for overlapping schedules" });
          }

          if (overlapResults.length > 0) {
            return res.status(400).json({ error: "Schedule overlaps with an existing event." });
          }

          // Increment the session number
          const sessionNumber = currentSessions + 1;

          // Save the new schedule
          const insertQuery = `
            INSERT INTO schedules (package_id, date, start_time, end_time, session_number)
            VALUES (?, ?, ?, ?, ?);
          `;

          db.query(insertQuery, [package_id, date, start_time, end_time, sessionNumber], (err, result) => {
            if (err) {
              console.error("Database insert error:", err);
              return res.status(500).json({ error: "Error saving schedule" });
            }

            res.status(201).json({ message: "Schedule created successfully!", sessionNumber });
          });
        }
      );
    });
  });
};




// Update a schedule
exports.updateSchedule = (req, res) => {
  const { id } = req.params;
  const { course_id, day, time, session_count } = req.body;
  const query = "UPDATE schedules SET course_id = ?, day = ?, time = ?, session_count = ? WHERE id = ?";
  db.query(query, [course_id, day, time, session_count, id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send("Schedule updated successfully!");
  });
};

// Delete a schedule
exports.deleteSchedule = (req, res) => {
  const { id } = req.params;

  // Fetch the package_id of the schedule to be deleted
  const fetchPackageIdQuery = "SELECT package_id FROM schedules WHERE id = ?";
  db.query(fetchPackageIdQuery, [id], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0) {
      return res.status(404).send("Schedule not found.");
    }

    const packageId = results[0].package_id;

    // Delete the schedule
    const deleteQuery = "DELETE FROM schedules WHERE id = ?";
    db.query(deleteQuery, [id], (err) => {
      if (err) return res.status(500).send(err);

      // Fetch the remaining schedules for the same package
      const fetchRemainingSchedulesQuery = `
        SELECT id
        FROM schedules
        WHERE package_id = ?
        ORDER BY date, start_time
      `;
      db.query(fetchRemainingSchedulesQuery, [packageId], (err, remainingSchedules) => {
        if (err) return res.status(500).send(err);

        // Update the session numbers of the remaining schedules
        const updatePromises = remainingSchedules.map((schedule, index) => {
          const updateQuery = "UPDATE schedules SET session_number = ? WHERE id = ?";
          return new Promise((resolve, reject) => {
            db.query(updateQuery, [index + 1, schedule.id], (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        });

        Promise.all(updatePromises)
          .then(() => {
            res.status(200).send("Schedule deleted and session numbers updated successfully!");
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      });
    });
  });
};

exports.fetchSchedulesBookable = async (req, res) => {
  try {
    let { packageIds, userId } = req.query; // Extract from query params

    if (!packageIds) {
      return res.status(400).json({ error: "Package IDs are required." });
    }
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    if (typeof packageIds === "string") {
      packageIds = packageIds.split(","); // Convert CSV string to array
    }

    const placeholders = packageIds.map(() => "?").join(",");

    const query = `
      SELECT s.id, s.package_id, s.start_time, s.end_time, s.date,
             pb.customer_id, pb.status,
             CONCAT(t.lastname, ', ', t.firstname, ' ', IFNULL(t.middlename, '')) AS tutor_name,
             p.name AS package_name, p.section
      FROM schedules s
        INNER JOIN package_booking pb ON s.package_id = pb.package_id
        INNER JOIN packages p ON p.id = pb.package_id
        INNER JOIN users t ON t.id = p.tutor_id
      WHERE pb.customer_id = ?
        AND pb.status IN ("Fully Paid", "Partially Paid")
        AND s.package_id IN (${placeholders}) 
      ORDER BY s.date, s.start_time;
    `;

    const params = [userId, ...packageIds]; // Corrected parameter order

    db.query(query, params, (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Failed to fetch schedules." });
      }

      return res.status(200).json(results);
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Failed to fetch schedules." });
  }
};


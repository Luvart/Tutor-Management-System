const db = require("../db");

// Get all packages
exports.getAllPackages = (req, res) => {
  const query = "SELECT * FROM packages";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

// Get tutor packages
exports.getTutorPackages = (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM packages WHERE tutor_id = ?";
  db.query(query,[id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

// Get packages to be enrolled
exports.getToEnrollPackage = (req, res) => {
  const query = `SELECT 
                  p.id, p.name, p.description, p.session_count, p.section, p.price, p.tutorialType,
                  CONCAT(t.lastname, ', ', t.firstname, ' ', IFNULL(t.middlename, '')) AS tutor_name,
                  t.gender 
              FROM packages p 
              JOIN users t ON p.tutor_id = t.id WHERE p.status ='Active'`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

// Get Active packages
exports.getActivePackages = (req, res) => {
  const query = "SELECT * FROM packages";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

// Create a new package
exports.createPackage = (req, res) => {
  const { name, section, session_count, price, tutorialType, assignedTutor, description,  status } = req.body;
  const query = "INSERT INTO packages (name, section, session_count, price, tutorialType, tutor_id, description, status) VALUES (?, ?, ?, ?, ?, ? , ?, ?)";

  db.query(query, [name, section, session_count, price, tutorialType, assignedTutor, description,  status], (err) => {
    if (err) return res.status(500).send(err);
    res.status(201).send("Package created successfully!");
  });
};

// Update a package
exports.updatePackage = (req, res) => {
  const { id } = req.params;
  const { name, section, session_count, price, tutorialType, description, assignedTutor, status } = req.body;

  const query = "UPDATE packages SET name = ?, section =?, session_count = ?, price = ?, tutorialType = ?, description = ?, tutor_id = ?, status =? WHERE id = ?";
  db.query(query, [name, section, session_count, price, tutorialType, description, assignedTutor, status,  id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send("Package updated successfully!");
  });
};

// Update a package
exports.updatePackageStatus = (req, res) => {
  const { packageId } = req.params;
  const { status } = req.body;

  const query = "UPDATE packages SET status = ? WHERE id = ?";
  db.query(query, [status, packageId], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send("Package updated successfully!");
  });
};

// Delete a package
exports.deletePackage = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM packages WHERE id = ?";

  db.query(query, [id], (err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send("Package deleted successfully!");
  });
};

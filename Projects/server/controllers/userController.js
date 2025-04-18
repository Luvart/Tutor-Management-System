const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
require("dotenv").config(); // Ensure to load the .env file
const JWT_SECRET = process.env.JWT_SECRET;

// Get All Users Without Pagination
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.promise().query("SELECT * FROM users");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving users." });
  }
};

// Get All Users with Pagination
exports.getAllUsersOrderCreatedByMssg = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;

  try {
    const [users] = await db.promise().query(
      `SELECT u.*, MAX(m.created_at) as latest_message_date
       FROM users u
       LEFT JOIN messages m ON u.id = m.sender_id OR u.id = m.receiver_id
       GROUP BY u.id
       ORDER BY latest_message_date DESC
       LIMIT ? OFFSET ?`,
      [parseInt(pageSize), parseInt(offset)]
    );
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving users." });
  }
};

// Get all students
exports.getAllStudentsEnrolled = (req, res) => {
  const { packageId } = req.query;
  const query = `
  SELECT pb.*,
  st.id as student_id,
       CONCAT(st.lastname, ', ', st.firstname, ' ', COALESCE(st.middlename, '')) AS student_name
            FROM package_booking pb
            JOIN users st ON st.id = pb.customer_id
            WHERE pb.package_id = ? AND st.role = "Customer"`;
  db.query(query, [packageId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
};

// Register User
exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const [existingUser] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    await db.promise().query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user." });
  }
};

// Create User via Admin
exports.createUserVAdmin = async (req, res) => {
  const { username, email, password, firstname, lastname, middlename, gender, role } = req.body;

  try {
    // Ensure required fields are provided
    if (!username || !email || !firstname || !lastname || !gender || !role) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Build the SQL query and parameters
    const query = `
      INSERT INTO users (username, email, password, firstname, lastname, middlename, gender, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const params = [username, email, hashedPassword, firstname, lastname, middlename, gender || null, role || 'user'];

    // Execute the query
    await db.promise().query(query, params);

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user." });
  }
};

// Login User with JWT Token Generation
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const [user] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!user.length) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT Token with Role
    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not configured." });
    }

    const token = jwt.sign(
      { id: user[0].id, email: user[0].email, role: user[0].role }, // Include role in token
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Include user data in the response if needed
    const userData = {
      id: user[0].id,
      username: user[0].username,
      email: user[0].email,
      role: user[0].role // Send role to the frontend
    };

    res.status(200).json({ message: "Login successful!", token, user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during login." });
  }
};


// Update User
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, firstname, lastname, middlename, gender, role, parentsInfo, parentsNumber } = req.body;

  try {
    let query = "UPDATE users SET username = ?, email = ?";
    const params = [username, email];

    // Conditionally update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ", password = ?";
      params.push(hashedPassword);
    }

    // Conditionally update parentsInfo if provided
    if (parentsInfo) {
      query += ", parentsInfo = ?";
      params.push(parentsInfo);
    }

    // Conditionally update parentsInfo if provided
    if (parentsNumber) {
      query += ", parentsNumber = ?";
      params.push(parentsNumber);
    }

    // Conditionally update firstname if provided
    if (firstname) {
      query += ", firstname = ?";
      params.push(firstname);
    }

    // Conditionally update lastname if provided
    if (lastname) {
      query += ", lastname = ?";
      params.push(lastname);
    }

    // Conditionally update middlename if provided
    if (middlename) {
      query += ", middlename = ?";
      params.push(middlename);
    }

    // Conditionally update gender if provided
    if (gender) {
      query += ", gender = ?";
      params.push(gender);
    }

    // Conditionally update role if provided
    if (role) {
      query += ", role = ?";
      params.push(role);
    }

    // Finish the query with the WHERE clause
    query += " WHERE id = ?";
    params.push(id);

    // Execute the query
    await db.promise().query(query, params);

    res.status(200).json({ message: "User updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user." });
  }
};


// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await db.promise().query("DELETE FROM users WHERE id = ?", [id]);
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user." });
  }
};

// GET /api/user/profile
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params; // Extract user ID from the authenticated token
    
    query = "SELECT * FROM users WHERE id = ?";
    const [user] = await db.promise().query(query, [userId]);
    res.json(user[0]);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// PUT /api/user/profile
exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params; // Extract user ID from the authenticated token
    const { username, email, firstname, lastname, middlename, gender } = req.body;

    // Validate required fields
    if (!username || !email || !firstname || !lastname || !gender) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Update query
    const query = `
      UPDATE users 
      SET username = ?, email = ?, firstname = ?, lastname = ?, middlename = ?, gender = ? 
      WHERE id = ?
    `;

    // Execute the query
    db.query(query, [username, email, firstname, lastname, middlename, gender, userId], (err) => {
      if (err) {
        console.error("Error updating user profile:", err);
        return res.status(500).json({ message: "Error updating profile." });
      }
      res.status(200).json({ message: "User updated successfully!" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

import { db } from "../config/db.js";
import bcrypt from "bcryptjs";

// Check if email or user_id already exists
export const findUserByLogin = (loginInput, callback) => {
  const query = "SELECT * FROM users WHERE email = ? OR user_id = ?";
  db.query(query, [loginInput, loginInput], callback);
};

export const findUserByEmailOrUserId = (email, user_id, callback) => {
  const query = "SELECT * FROM users WHERE email = ? OR user_id = ?";
  db.query(query, [email, user_id], callback);
};

// Create user with manual user_id
export const createUser = (name, email, password, user_id, callback) => {
  const hashed = bcrypt.hashSync(password, 10);
  const query =
    "INSERT INTO users (name, email, password, user_id) VALUES (?, ?, ?, ?)";
  db.query(query, [name, email, hashed, user_id], callback);
};

// Find user by ID (for /me)
export const findUserById = (id, callback) => {
  const query = "SELECT id, user_id, name, email FROM users WHERE id = ?";
  db.query(query, [id], callback);
};

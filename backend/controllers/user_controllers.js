import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generate_token.js";
import {
  findUserByLogin,
  findUserByEmailOrUserId,
  createUser,
  findUserById
} from "../models/user_model.js";

// ✅ Register user manually with user_id
export const registerUser = (req, res) => {
  const { user_id, name, email, password } = req.body;

  if (!user_id || !name || !email || !password)
    return res.status(400).json({ message: "Please fill all fields" });

  // Check duplicate email or user_id
  findUserByEmailOrUserId(email, user_id, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length > 0)
      return res.status(400).json({ message: "Email or User ID already exists" });

    // Create user
    createUser(name, email, password, user_id, (err, result) => {
      if (err) return res.status(500).json(err);

      const token = generateToken(result.insertId);
      res.status(201).json({
        id: result.insertId,
        user_id,
        name,
        email,
        token,
      });
    });
  });
};

// ✅ Login user (email or user_id)
export const loginUser = (req, res) => {
  const { email, user_id, password } = req.body;
  const loginInput = email || user_id;

  if (!loginInput || !password)
    return res.status(400).json({ message: "Enter email/user_id and password" });

  findUserByLogin(loginInput, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid password" });

    const token = generateToken(user.id);
    res.json({
      id: user.id,
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      token,
    });
  });
};

// ✅ Get logged-in user
export const getMe = (req, res) => {
  const userId = req.user?.id;
  if (!userId)
    return res.status(401).json({ message: "Unauthorized" });

  findUserById(userId, (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json(result[0]);
  });
};

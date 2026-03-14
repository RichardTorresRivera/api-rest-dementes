import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "../../config/env.js";
import { createUser, getUserByEmail } from "./auth.model.js";

export const loginRequest = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userToken = {
      id: user.id,
      email: user.email,
      rol: user.rol,
    };
    const token = jwt.sign(userToken, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ message: "Login successful", user: userToken });
  } catch (error) {
    next(error);
  }
};

export const logoutRequest = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

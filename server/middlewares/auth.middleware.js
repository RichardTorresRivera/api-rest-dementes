import jwt from "jsonwebtoken";
import { JWT } from "../config/env.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Formato de token inválido" });
    }

    const token = parts[1];
    let payload;
    try {
      payload = jwt.verify(token, JWT.secret);
    } catch (err) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;

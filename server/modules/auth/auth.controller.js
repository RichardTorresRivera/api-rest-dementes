import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT, BCRYPT_SALT_ROUNDS } from "../../config/env.js";
import { getUserByEmail, createUser } from "./auth.model.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email y password requeridos" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const payload = {
      sub: user.id,
      role: user.role,
      tv: user.token_version || 0,
    };

    const token = jwt.sign(payload, JWT.secret, {
      expiresIn: JWT.expiresIn,
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email y password requeridos" });
    }

    const saltRounds = BCRYPT_SALT_ROUNDS;
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = await createUser(email, hash);

    res.status(201).json({ user: newUser });
  } catch (err) {
    next(err);
  }
};

import db from "../../config/postgres.js";

export const getUserByEmail = async (email) => {
  const res = await db.oneOrNone(
    "SELECT id, email, password_hash, role, token_version FROM users WHERE email = $1",
    [email]
  );
  return res;
};

export const getUserById = async (id) => {
  const res = await db.oneOrNone(
    "SELECT id, email, role, token_version FROM users WHERE id = $1",
    [id]
  );
  return res;
};

export const createUser = async (email, passwordHash, role = "user") => {
  const res = await db.oneOrNone(
    "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role",
    [email, passwordHash, role]
  );
  return res;
};

export const incrementTokenVersion = async (userId) => {
  await db.query(
    "UPDATE users SET token_version = token_version + 1 WHERE id = $1",
    [userId]
  );
};

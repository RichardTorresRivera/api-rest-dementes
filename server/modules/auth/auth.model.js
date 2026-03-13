import db from "../../config/postgres.js";

export const createUser = async ({ rol, email, password }) => {
  const user = await db.one(
    "INSERT INTO usuario (rol, email, password) VALUES ($1, $2, $3) RETURNING id_usuario, rol, email",
    [rol, email, password],
  );
  return user;
};

export const getUserByEmail = async (email) => {
  const user = await db.oneOrNone(
    "SELECT id_usuario, rol, email, password FROM usuario WHERE email = $1",
    [email],
  );
  return user;
};

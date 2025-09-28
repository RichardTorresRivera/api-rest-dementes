import db from "../../config/postgres.js";

export const getPaciente = async ({ id_paciente }) => {
  const paciente = await db.oneOrNone(
    `SELECT *
    FROM paciente
    WHERE id_paciente = $1;`,
    [id_paciente]
  );
  return paciente;
};

export const getPacientes = async ({ nombre, limit, offset }) => {
  const pacientes = await db.any(
    `SELECT *, COUNT(*) OVER() AS total
    FROM paciente
    ${
      nombre
        ? "WHERE LOWER(CONCAT(nombre, ' ', apellido_paterno, ' ', apellido_materno)) LIKE '%' || $1 || '%'"
        : ""
    }
    ORDER BY nombre, apellido_paterno, apellido_materno, id_paciente
    LIMIT $2 OFFSET $3;`,
    [nombre, limit, offset]
  );
  return pacientes;
};

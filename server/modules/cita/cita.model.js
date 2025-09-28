import db from "../../config/postgres.js";

export const getCitas = async ({
  id_psicologo,
  id_paciente,
  estado,
  fecha_inicio,
  fecha_fin,
  limit,
  offset,
}) => {
  const filters = [];
  const values = [];
  let i = 1;

  if (id_psicologo) {
    filters.push(`c.id_psicologo = $${i++}`);
    values.push(id_psicologo);
  }

  if (id_paciente) {
    filters.push(`c.id_paciente = $${i++}`);
    values.push(id_paciente);
  }

  if (estado) {
    filters.push(`c.estado = $${i++}`);
    values.push(estado);
  }

  if (fecha_inicio && fecha_fin) {
    filters.push(`c.fecha BETWEEN $${i} AND $${i + 1}`);
    values.push(fecha_inicio, fecha_fin);
    i += 2;
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  values.push(limit, offset);

  const sql = `
    SELECT
      c.id_cita,
      c.fecha,
      t.hora_inicio,
      c.motivo,
      c.estado,
      c.online,
      c.comentario,
      c.id_psicologo,
      CONCAT(psc.nombre, ' ', psc.apellido_paterno, ' ', psc.apellido_materno) AS nombre_psicologo,
      c.id_paciente,
      CONCAT(pac.nombre, ' ', pac.apellido_paterno, ' ', pac.apellido_materno) AS nombre_paciente,
      COUNT(*) OVER() AS total
    FROM cita c
    INNER JOIN paciente pac ON pac.id_paciente = c.id_paciente
    INNER JOIN psicologo psc ON psc.id_psicologo = c.id_psicologo
    INNER JOIN horario h ON h.id_horario = c.id_horario
    INNER JOIN turno t ON t.id_turno = h.id_turno
    ${whereClause}
    ORDER BY c.fecha DESC, t.hora_inicio ASC
    LIMIT $${i++} OFFSET $${i++};
    `;

  return await db.any(sql, values);
};

export const getCita = async ({ id_cita }) => {
  const cita = await db.any(
    `
    SELECT
      c.id_cita,
      c.fecha,
      t.hora_inicio,
      c.motivo,
      c.estado,
      c.online,
      c.comentario,
      c.id_psicologo,
      CONCAT(psc.nombre, ' ', psc.apellido_paterno, ' ', psc.apellido_materno) AS nombre_psicologo,
      c.id_paciente,
      CONCAT(pac.nombre, ' ', pac.apellido_paterno, ' ', pac.apellido_materno) AS nombre_paciente,
    FROM cita c
    INNER JOIN paciente pac ON pac.id_paciente = c.id_paciente
    INNER JOIN psicologo psc ON psc.id_psicologo = c.id_psicologo
    INNER JOIN horario h ON h.id_horario = c.id_horario
    INNER JOIN turno t ON t.id_turno = h.id_turno
    WHERE c.id_cita = $1;`,
    [id_cita]
  );

  return cita;
};

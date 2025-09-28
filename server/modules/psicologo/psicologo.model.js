import db from "../../config/postgres.js";

const sqlSelectBasicoPsicologo = `
  p.id_psicologo,
  p.nombre,
  p.apellido_paterno,
  p.apellido_materno,
  p.foto,
  p.dni,
  p.disponible
`;

const sqlEspecialidadesPsicologo = `
  (
    SELECT JSON_AGG(JSON_BUILD_OBJECT(
      'id_especialidad', se.id_especialidad,
      'nombre', se.nombre
    ))
    FROM (
      SELECT DISTINCT e.id_especialidad, e.nombre
      FROM especialidad_psicologo ep
      JOIN especialidad e ON e.id_especialidad = ep.id_especialidad
      WHERE ep.id_psicologo = p.id_psicologo
    ) se
  ) AS especialidades
`;

const sqlHorariosPsicologo = `
  (
    SELECT JSON_AGG(JSON_BUILD_OBJECT(
      'dia', sh.dia,
      'turnos', (
        SELECT JSON_AGG(JSON_BUILD_OBJECT(
          'id_horario', sh2.id_horario,
          'hora_inicio', sh2.hora_inicio,
          'hora_fin', sh2.hora_fin,
          'disponible', sh2.disponible
        ))
        FROM (
          SELECT h.id_horario, t.hora_inicio, t.hora_fin, h.disponible
          FROM horario h
          JOIN turno t ON t.id_turno = h.id_turno
          WHERE h.id_psicologo = p.id_psicologo AND h.dia = sh.dia
          ORDER BY t.hora_inicio
        ) sh2
      )
    ))
    FROM (
      SELECT DISTINCT h.dia
      FROM horario h
      WHERE h.id_psicologo = p.id_psicologo
    ) sh
  ) AS horarios
`;

export const getPsicologos = async ({
  nombre,
  consulta_online,
  id_especialidades,
  dias,
  limit,
  offset,
}) => {
  const filters = [`p.disponible = TRUE`];
  const values = [];
  let i = 1;

  if (nombre) {
    filters.push(
      `LOWER(CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno)) LIKE '%' || $${i++} || '%'`
    );
    values.push(nombre);
  }

  if (consulta_online !== undefined && consulta_online !== null) {
    filters.push(`p.consulta_online = $${i++}`);
    values.push(consulta_online);
  }

  if (id_especialidades && id_especialidades.length > 0) {
    filters.push(`
      EXISTS (
        SELECT 1
        FROM especialidad_psicologo ep
        WHERE ep.id_psicologo = p.id_psicologo
          AND ep.id_especialidad = ANY($${i++})
      )
    `);
    values.push(id_especialidades);
  }

  if (dias && dias.length > 0) {
    filters.push(`
      EXISTS (
        SELECT 1
        FROM horario h
        WHERE h.id_psicologo = p.id_psicologo
          AND h.dia = ANY($${i++}::dia_enum[])
      )
    `);
    values.push(dias);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  values.push(limit, offset);

  const sql = `
    SELECT 
      ${sqlSelectBasicoPsicologo + ","}
      p.descripcion,
      p.consulta_online,

      -- Especialidades
      ${sqlEspecialidadesPsicologo + ","}

      -- Horarios
      ${sqlHorariosPsicologo + ","}

      -- Total
      COUNT(*) OVER() AS total

    FROM psicologo p
    ${whereClause}
    ORDER BY p.nombre, p.apellido_paterno, p.apellido_materno, p.id_psicologo
    LIMIT $${i++} OFFSET $${i++};
    `;
  return await db.any(sql, values);
};

export const getPsicologo = async ({ id_psicologo }) => {
  const psicologo = await db.oneOrNone(
    `SELECT 
      ${sqlSelectBasicoPsicologo + ","}
      p.descripcion,
      p.consulta_online,

      -- Especialidades
      ${sqlEspecialidadesPsicologo + ","}

      -- Horarios
      ${sqlHorariosPsicologo}

    FROM psicologo p
    WHERE p.id_psicologo = $1;`,
    [id_psicologo]
  );
  return psicologo;
};

export const getPerfilPsicologos = async ({
  nombre,
  disponible,
  limit,
  offset,
}) => {
  const filters = [];
  const values = [];
  let i = 1;

  if (nombre) {
    filters.push(
      `LOWER(CONCAT(p.nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno)) LIKE '%' || $${i++} || '%'`
    );
    values.push(nombre);
  }

  if (disponible !== undefined && disponible !== null) {
    filters.push(`p.disponible = $${i++}`);
    values.push(disponible);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  values.push(limit, offset);

  const sql = `
    SELECT
      ${sqlSelectBasicoPsicologo + ","}
      COUNT(*) OVER() AS total
    FROM psicologo p
    ${whereClause}
    ORDER BY p.nombre, p.apellido_paterno, p.apellido_materno, p.id_psicologo
    LIMIT $${i++} OFFSET $${i++};
  `;

  return await db.any(sql, values);
};

export const getPerfilPsicologo = async ({ id_psicologo }) => {
  const psicologo = await db.oneOrNone(
    `SELECT
      ${sqlSelectBasicoPsicologo}
    FROM psicologo p
    WHERE p.id_psicologo = $1;`,
    [id_psicologo]
  );
  return psicologo;
};

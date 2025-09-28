export const parsePaginationParams = (query) => {
  const page = parseInt(query.page || 1, 10);
  const limit = parseInt(query.limit || 10, 10);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

export const parseStringToBoolean = (value) => {
  if (typeof value !== "string") return null;
  return value === "true";
};

export const formatNombre = (nombre) =>
  typeof nombre === "string" ? nombre.trim().toLowerCase() : null;

export const formatIdEspecialidades = (id) => {
  if (Array.isArray(id)) return id.map(Number);
  if (id !== null && id !== undefined) return [Number(id)];
  return null;
};

export const formatDiasAtencion = (dia) => {
  if (Array.isArray(dia)) return dia;
  if (dia !== null && dia !== undefined) return [dia];
  return null;
};

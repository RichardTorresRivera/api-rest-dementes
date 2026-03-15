import bcrypt from "bcrypt";
import db from "../../config/postgres.js";
import handlePaginationRequest from "../../helpers/pagination.js";
import {
  formatNombre,
  parseStringToBoolean,
  formatIdEspecialidades,
  formatDiasAtencion,
} from "../../helpers/format_parameters.js";
import {
  getPerfilPsicologo,
  getPsicologos,
  getPsicologo,
  getPerfilPsicologos,
  getPsicologoByDNI,
  createPsicologo,
} from "./psicologo.model.js";
import { createUser, getUserByEmail } from "../auth/auth.model.js";

export const psicologosRequest = (req, res, next) =>
  handlePaginationRequest({
    req,
    res,
    next,
    getDataFn: getPsicologos,
    extraParams: (query) => ({
      nombre: formatNombre(query.nombre),
      consulta_online: parseStringToBoolean(query.consulta_online),
      id_especialidades: formatIdEspecialidades(query.id_especialidades),
      dias: formatDiasAtencion(query.dias),
    }),
  });

export const psicologoRequest = async (req, res, next) => {
  try {
    const id_psicologo = req.params.id;
    const psicologo = await getPsicologo({ id_psicologo });

    if (!psicologo)
      return res.status(404).json({ message: "Psicologo no encontrado" });

    res.status(200).json({ data: psicologo });
  } catch (error) {
    next(error);
  }
};

export const perfilPsicologosRequest = async (req, res, next) =>
  handlePaginationRequest({
    req,
    res,
    next,
    getDataFn: getPerfilPsicologos,
    extraParams: (query) => ({
      nombre: formatNombre(query.nombre),
      disponible: parseStringToBoolean(query.disponible),
    }),
  });

export const perfilPsicologoRequest = async (req, res, next) => {
  try {
    const id_psicologo = req.params.id;

    const psicologo = await getPerfilPsicologo({ id_psicologo });

    if (!psicologo)
      return res.status(404).json({ message: "Psicologo no encontrado" });

    res.status(200).json({ data: psicologo });
  } catch (error) {
    next(error);
  }
};

export const createPsicologoRequest = async (req, res, next) => {
  const { email, password, nombre, apellido_paterno, apellido_materno, dni } =
    req.body;
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "The email is already registered" });
    }

    const existingDNI = await getPsicologoByDNI(dni);
    if (existingDNI) {
      return res.status(400).json({ error: "The DNI is already registered" });
    }

    await db.tx(async (t) => {
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = await createUser(
        { rol: "psicologo", email, password: hashPassword },
        { client: t },
      );

      const psicologo = await createPsicologo(
        {
          id_usuario: newUser.id_usuario,
          nombre,
          apellido_paterno,
          apellido_materno,
          dni,
        },
        { client: t },
      );

      res
        .status(201)
        .json({ message: "Psicologo created successfully", data: psicologo });
    });
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ error: "The email or DNI is already registered" });
    }
    next(error);
  }
};

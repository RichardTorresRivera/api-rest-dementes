import bcrypt from "bcrypt";
import { formatNombre } from "../../helpers/format_parameters.js";
import handlePaginationRequest from "../../helpers/pagination.js";
import {
  getPaciente,
  getPacientes,
  getPacienteByDNI,
  createPaciente,
} from "./paciente.model.js";
import { createUser, getUserByEmail } from "../auth/auth.model.js";
import db from "../../config/postgres.js";

export const pacientesRequest = (req, res, next) =>
  handlePaginationRequest({
    req,
    res,
    next,
    getDataFn: getPacientes,
    extraParams: (query) => ({
      nombre: formatNombre(query.nombre),
    }),
  });

export const pacienteRequest = async (req, res, next) => {
  try {
    const id_paciente = req.params.id;
    const paciente = await getPaciente({ id_paciente });
    res.status(200).json({ data: paciente });
  } catch (error) {
    next(error);
  }
};

export const createPacienteRequest = async (req, res, next) => {
  const {
    email,
    password,
    nombre,
    apellido_paterno,
    apellido_materno,
    dni,
    genero,
  } = req.body;
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "The email is already registered" });
    }

    const existingDNI = await getPacienteByDNI(dni);
    if (existingDNI) {
      return res.status(400).json({ error: "The DNI is already registered" });
    }

    await db.tx(async (t) => {
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = await createUser(
        { rol: "paciente", email, password: hashPassword },
        { client: t },
      );

      const paciente = await createPaciente(
        {
          id_usuario: newUser.id_usuario,
          nombre,
          apellido_paterno,
          apellido_materno,
          dni,
          genero,
        },
        { client: t },
      );

      res
        .status(201)
        .json({ message: "Paciente created successfully", data: paciente });
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

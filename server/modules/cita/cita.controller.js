import handlePaginationRequest from "../../helpers/pagination.js";

import { getCita, getCitas } from "./cita.model.js";

export const citasRequest = async (req, res, next) => {
  handlePaginationRequest({
    req,
    res,
    next,
    getDataFn: getCitas,
  });
};

export const citaRequest = async (req, res, next) => {
  try {
    const id_cita = req.params.id;
    const cita = await getCita({ id_cita });
    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }
    res.status(200).json({ data: cita });
  } catch (error) {
    next(error);
  }
};

export const citasByPsicologoRequest = async (req, res, next) => {
  handlePaginationRequest({
    req,
    res,
    next,
    getDataFn: getCitas,
    extraParams: (query) => ({
      id_psicologo: req.params.id,
    }),
  });
};

export const citasByPacienteRequest = async (req, res, next) => {
  handlePaginationRequest({
    req,
    res,
    next,
    getDataFn: getCitas,
    extraParams: (query) => ({
      id_paciente: req.params.id,
    }),
  });
};

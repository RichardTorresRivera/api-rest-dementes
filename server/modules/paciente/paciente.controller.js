import { formatNombre } from "../../helpers/format_parameters.js";
import handlePaginationRequest from "../../helpers/pagination.js";
import { getPaciente, getPacientes } from "./paciente.model.js";

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

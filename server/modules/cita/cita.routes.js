import { Router } from "express";
import {
  citaRequest,
  citasRequest,
  citasByPacienteRequest,
  citasByPsicologoRequest,
} from "./cita.controller.js";

const router = Router();

router.get("/citas/psicologo/:id", citasByPsicologoRequest);
router.get("/citas/paciente/:id", citasByPacienteRequest);
router.get("/citas/:id", citaRequest);
router.get("/citas", citasRequest);

export default router;

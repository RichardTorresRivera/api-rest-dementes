import { Router } from "express";
import {
  pacienteRequest,
  pacientesRequest,
  createPacienteRequest,
} from "./paciente.controller.js";
import { createPacienteValidator } from "./paciente.validator.js";

const router = Router();

router.get("/pacientes/:id", pacienteRequest);
router.get("/pacientes", pacientesRequest);
router.post("/pacientes", createPacienteValidator, createPacienteRequest);

export default router;

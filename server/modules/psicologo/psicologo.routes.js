import { Router } from "express";
import {
  perfilPsicologosRequest,
  perfilPsicologoRequest,
  psicologoRequest,
  psicologosRequest,
  createPsicologoRequest,
} from "./psicologo.controller.js";
import { createPsicologoValidator } from "./psicologo.validator.js";
import { verifyToken, hasRole } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/psicologos/perfiles", perfilPsicologosRequest);
router.get("/psicologos/perfiles/:id", perfilPsicologoRequest);
router.get("/psicologos/:id", psicologoRequest);
router.get("/psicologos", psicologosRequest);
router.post(
  "/psicologos",
  verifyToken,
  hasRole("admin"),
  createPsicologoValidator,
  createPsicologoRequest,
);

export default router;

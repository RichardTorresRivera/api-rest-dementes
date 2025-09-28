import express from "express";
import {
  unknownEndpoint,
  errorHandler,
} from "./middlewares/error.middleware.js";
import { requestLogger } from "./middlewares/logger.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import authMiddleware from "./middlewares/auth.middleware.js";

import psicoRouter from "./modules/psicologo/psicologo.routes.js";
import citaRouter from "./modules/cita/cita.routes.js";
import espRouter from "./modules/especialidad/especialidad.routes.js";
import horarioRouter from "./modules/horario/horario.routes.js";
import pacienteRouter from "./modules/paciente/paciente.routes.js";

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRoutes);

app.use("/api", authMiddleware, psicoRouter);
app.use("/api", authMiddleware, espRouter);
app.use("/api", authMiddleware, citaRouter);
app.use("/api", authMiddleware, horarioRouter);
app.use("/api", authMiddleware, pacienteRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;

import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validator.middleware.js";

export const createPsicologoValidator = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("nombre")
    .isLength({ min: 2, max: 100 })
    .withMessage("Nombre must be between 2 and 100 characters long"),
  body("apellido_paterno")
    .isLength({ min: 2, max: 100 })
    .withMessage("Apellido paterno must be between 2 and 100 characters long"),
  body("apellido_materno")
    .isLength({ min: 2, max: 100 })
    .withMessage("Apellido materno must be between 2 and 100 characters long"),
  body("dni")
    .isLength({ min: 8, max: 8 })
    .withMessage("DNI must be exactly 8 characters long"),
  validateRequest,
];

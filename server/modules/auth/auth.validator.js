import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validator.middleware.js";

export const loginValidator = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  validateRequest,
];

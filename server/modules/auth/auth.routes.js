import { Router } from "express";
import { loginValidator } from "./auth.validator.js";
import {
  createUserRequest,
  loginRequest,
  logoutRequest,
} from "./auth.controller.js";

const router = Router();

router.post("/login", loginValidator, loginRequest);
router.post("/logout", logoutRequest);
router.post("/register", createUserRequest);

export default router;

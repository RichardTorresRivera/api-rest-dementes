import { Router } from "express";
import {
  createUserRequest,
  loginRequest,
  logoutRequest,
} from "./auth.controller.js";

const router = Router();

router.post("/login", loginRequest);
router.post("/logout", logoutRequest);
router.post("/register", createUserRequest);

export default router;

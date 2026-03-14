import { Router } from "express";
import { loginValidator } from "./auth.validator.js";
import { loginRequest, logoutRequest } from "./auth.controller.js";

const router = Router();

router.post("/login", loginValidator, loginRequest);
router.post("/logout", logoutRequest);

export default router;

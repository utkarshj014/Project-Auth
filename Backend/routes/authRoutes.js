import express from "express";

import { verifyToken } from "../middlewares/verifyToken.js";
import {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/authController.js";

const router = express.Router();

router
  .get("/check-auth", verifyToken, checkAuth)
  .post("/signup", signup)
  .post("/login", login)
  .post("/logout", logout)
  .post("/verify-email", verifyEmail)
  .post("/forgot-password", forgotPassword)
  .post("/reset-password/:token", resetPassword);

export default router;

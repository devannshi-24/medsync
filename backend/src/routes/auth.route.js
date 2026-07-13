import { auth } from "google-auth-library";
import { changePassword, forgotPassword, register, resetPassword, sendOTP, verifyOTP } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";
import { googleAuth } from "../controllers/auth.controller.js";

import express from "express";
import isAuth from "../middleware/isAuth.js";

const authRouter= express.Router();

authRouter.post("/register",register) // have to remove this
authRouter.post("/google",googleAuth)
authRouter.post("/send-otp",sendOTP)
authRouter.post("/verify-otp",verifyOTP)
authRouter.post("/login",login)
authRouter.post("/logout",logout)
authRouter.post("/forgot-password",forgotPassword)
authRouter.post("/reset-password",resetPassword)
authRouter.post("/change-password",isAuth,changePassword)

export default authRouter
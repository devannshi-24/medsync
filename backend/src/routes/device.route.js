import express from "express";
import isAuth from "../middleware/isAuth.js"
import { registerDevice } from "../controllers/device.controller.js"

const deviceRouter= express.Router()

deviceRouter.post("/register",isAuth,registerDevice)

export default deviceRouter
import express from "express"
import { getDashboard } from "../controllers/dashboard.controller.js"
import isAuth from "../middleware/isAuth.js"

const dashboardRouter= express.Router()

dashboardRouter.get("/",isAuth,getDashboard)

export default dashboardRouter
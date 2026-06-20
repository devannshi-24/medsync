import express from "express"
import { addDoseLog, getDoseLogs,getAllDoseLogs} from "../controllers/doselog.controller.js"
import isAuth  from "../middleware/isAuth.js";


const doseLogRouter= express.Router()

doseLogRouter.post("/", isAuth,addDoseLog)
doseLogRouter.get("/schedule/:scheduleId",isAuth,getDoseLogs)
doseLogRouter.get("/",isAuth,getAllDoseLogs)

export default doseLogRouter
import express from "express"
import { addSymptom, getSymptoms,getSymptomById,deleteSymptom, updateSymptom } from "../controllers/symptom.controller.js"

import isAuth from "../middleware/isAuth.js"

const symptomRouter= express.Router();

symptomRouter.post("/",isAuth,addSymptom)
symptomRouter.get("/",isAuth,getSymptoms)
symptomRouter.get("/:id",isAuth,getSymptomById)
symptomRouter.delete("/:id",isAuth,deleteSymptom)
symptomRouter.put("/:id",isAuth,updateSymptom)

export default symptomRouter
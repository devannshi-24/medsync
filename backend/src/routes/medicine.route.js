import express from "express"
import { addMedicine, getMedicines, getMedicineById, deleteMedicine, updateMedicine } from "../controllers/medicine.controller.js"
import isAuth  from "../middleware/isAuth.js";

const medicineRouter = express.Router()

medicineRouter.post("/",isAuth,addMedicine)
medicineRouter.get("/",isAuth,getMedicines)
medicineRouter.get("/:id",isAuth,getMedicineById)
medicineRouter.delete("/:id",isAuth,deleteMedicine)
medicineRouter.put("/:id",isAuth,updateMedicine)


export default medicineRouter

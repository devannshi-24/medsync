import express from 'express';
import { addSchedule, getSchedules, getScheduleById, deleteSchedule, updateSchedule, getActiveSchedules, deactivateSchedule, activateSchedule, snoozeReminder } from '../controllers/schedule.controller.js';    
import isAuth from '../middleware/isAuth.js';

const scheduleRouter = express.Router();


scheduleRouter.post("/",isAuth,addSchedule)
scheduleRouter.get("/",isAuth,getSchedules)
scheduleRouter.get("/active",isAuth,getActiveSchedules)
scheduleRouter.get("/:id",isAuth,getScheduleById)
scheduleRouter.delete("/:id",isAuth,deleteSchedule)
scheduleRouter.put("/:id",isAuth,updateSchedule)
scheduleRouter.patch("/:id/deactivate",isAuth,deactivateSchedule)
scheduleRouter.patch("/:id/activate",isAuth,activateSchedule)
scheduleRouter.post("/snooze",isAuth,snoozeReminder)

export default scheduleRouter



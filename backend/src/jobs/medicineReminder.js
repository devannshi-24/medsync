
import Schedule from "../models/schedule.model.js"
import Device from "../models/device.model.js";
import Medicine from "../models/medicine.model.js";
import { sendNotification } from "../services/notification.service.js";
import { isScheduleDueToday,isTimeDue } from "../utils/schedule.utils.js";
import cron from "node-cron";


const startMedicineReminderJob = () => {

    cron.schedule("* * * * *",async () => {
        const now= new Date()
        const schedules= await Schedule.find({
            isActive:true,
            startDate: {$lte: now},
            endDate: {$gte:now}
        })
        .populate("medicineId","name")
        .populate("userId")

        for(const schedule of schedules){
            if(!isScheduleDueToday(schedule))
                continue
            if(!isTimeDue(schedule))
                continue

            console.log(
                "Reminder Due:",
                schedule.medicineId.name
            )
        }
    });

};

export default startMedicineReminderJob;
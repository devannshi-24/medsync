import Schedule from "../models/schedule.model.js";
import Device from "../models/device.model.js";
import Medicine from "../models/medicine.model.js";
import { sendNotification } from "../services/notification.service.js";
import {
  isScheduleDueToday,
  isTimeDue,
  hasReminderBeenSent,
} from "../utils/schedule.utils.js";
import cron from "node-cron";

const startMedicineReminderJob = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const schedules = await Schedule.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .populate("medicineId", "name")
      .populate("userId");

    for (const schedule of schedules) {
      let shouldSend = false;

      if (schedule.snoozedUntil && schedule.snoozedUntil <= now) {
        shouldSend = true;
      } else {
        if (!isScheduleDueToday(schedule)) continue;

        if (!isTimeDue(schedule)) continue;

        shouldSend = true;
      }

      if (!shouldSend) continue;

      if (hasReminderBeenSent(schedule)) {
        console.log("Already sent:", schedule.medicineId.name);
        continue;
      }

      const device = await Device.findOne({
        userId: schedule.userId._id,
        platform: "web",
      });
      if (!device) {
        console.log("No registered device for user:", schedule.userId._id);
        continue;
      }

      try {
        await sendNotification(
          device.fcmToken,
          "💊 Medicine Reminder",
          `${schedule.medicineId.name}
Dosage: ${schedule.dosage}
Scheduled: ${schedule.times.join(", ")}

Please take your medicine and update your dose status in MediSync.`,
          {
            scheduleId: schedule._id.toString(),
          },
        );



        schedule.lastReminderSent = now;
        schedule.snoozedUntil = null;
        await schedule.save();

        console.log(`Notification sent for ${schedule.medicineId.name}`);
      } catch (error) {
        console.log(
          `Failed to send notification for ${schedule.medicineId.name}:`,
          error.message,
        );
      }
    }
  });
};

export default startMedicineReminderJob;

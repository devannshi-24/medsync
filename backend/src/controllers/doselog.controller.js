import DoseLog from "../models/doselog.model.js";
import Schedule from "../models/schedule.model.js";

export const addDoseLog = async (req, res) => {
  try {
    const user = req.user;
    const { scheduleId, status } = req.body;

    const schedule = await Schedule.findOne({
      _id: scheduleId,
      userId: user._id,
    }).populate("medicineId", "name");
    if (!schedule) {
      return res.status(404).json({ message: "no schedule found to log dose" });
    }

    const doselog = new DoseLog({
      userId: user._id,
      scheduleId,
      // changes
      medicineName: schedule.medicineId.name,
      dosage: schedule.dosage,
      // .
      status,
    });
    await doselog.save();
    if (!doselog) {
      return res.status(400).json({ message: "Failed to log dose" });
    }

    if (status === "taken" || status === "missed") {
      await Schedule.findByIdAndUpdate(scheduleId, {
        snoozedUntil: null,
      });
    }

    res.status(201).json({ doselog, message: "Dose logged successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while logging dose", error: err.message });
  }
};

export const getDoseLogs = async (req, res) => {
  try {
    const user = req.user;
    const scheduleId = req.params.scheduleId;

    const doseLogs = await DoseLog.find({
      userId: user._id,
      scheduleId,
    }).populate({
      path: "scheduleId",
      select: "medicineId dosage frequency times",
      populate: {
        path: "medicineId",
        select: "name",
      },
    });

    if (doseLogs.length === 0) {
      return res.status(200).json({
        message: "No dose logs found",
        doseLogs: [],
        count: 0,
      });
    }
    res.status(200).json({ doseLogs });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while retrieving dose log", error: err.message });
  }
};

export const getAllDoseLogs = async (req, res) => {
  try {
    const user = req.user;

    const doseLogs = await DoseLog.find({ userId: user._id }).populate({
      path: "scheduleId",
      select: "medicineId dosage frequency times",
      populate: {
        path: "medicineId",
        select: "name",
      },
    });

    if (doseLogs.length === 0) {
      return res.status(200).json({
        doseLogs: [],
        count: 0,
        message: "No dose logs found",
      });
    }
    res.status(200).json({ doseLogs });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error while retrieving dose logs",
        error: err.message,
      });
  }
};

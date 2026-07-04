import Schedule from "../models/schedule.model.js";
import Medicine from "../models/medicine.model.js";

export const addSchedule = async (req, res) => {
  try {
    console.log("addSchedule called");
    const user = req.user;
    const { medicineId, dosage, frequency, times, startDate, endDate } =
      req.body;

    const medicine = await Medicine.findOne({
      _id: medicineId,
      userId: user._id,
      isDeleted: false,
    });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    console.log(req.body);
    console.log("Frequency:", req.body.frequency);
    const schedule = new Schedule({
      userId: user._id,
      medicineId,
      dosage,
      frequency,
      times,
      startDate,
      endDate,
    });
    await schedule.save();
    if (!schedule) {
      return res.status(400).json({ message: "Failed to create schedule" });
    }
    res
      .status(201)
      .json({ schedule, message: "Schedule created successfully" });
  } catch (err) {
    console.error(err);
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Error while creating schedule", error: err.message });
  }
};

export const getSchedules = async (req, res) => {
  try {
    const user = req.user;
    const schedules = await Schedule.find({
      userId: user._id,
    }).populate("medicineId", "name");
    if (!schedules) {
      return res.status(404).json({ message: "No schedules found" });
    }
    res
      .status(200)
      .json({ schedules, message: "Schedules fetched successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while fetching schedules", error: err.message });
  }
};

export const getScheduleById = async (req, res) => {
  try {
    const user = req.user;
    const scheduleId = req.params.id;
    const schedule = await Schedule.findOne({
      _id: scheduleId,
      userId: user._id,
    }).populate("medicineId", "name");
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res
      .status(200)
      .json({ schedule, message: "Schedule fetched successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while fetching schedule", error: err.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const user = req.user;
    const scheduleId = req.params.id;
    const { medicineId, dosage, frequency, times, startDate, endDate } =
      req.body;

    const medicine = await Medicine.findOne({
      _id: medicineId,
      userId: user._id,
      isDeleted: false,
    });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    const schedule = await Schedule.findOneAndUpdate(
      { _id: scheduleId, userId: user._id },
      {
        $set: {
          medicineId,
          dosage,
          frequency,
          times,
          startDate,
          endDate,
        },
      },
      { new: true },
    ).populate("medicineId", "name");

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res
      .status(200)
      .json({ schedule, message: "Schedule updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while updating schedule", error: err.message });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const user = req.user;
    const scheduleId = req.params.id;
    const schedule = await Schedule.findOneAndDelete({
      _id: scheduleId,
      userId: user._id,
    });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while deleting schedule", error: err.message });
  }
};

export const getActiveSchedules = async (req, res) => {
  try {
    const user = req.user;
    const schedules = await Schedule.find({
      userId: user._id,
      isActive: true,
      endDate: { $gte: new Date() },
    }).populate("medicineId", "name");
    if (!schedules) {
      return res.status(404).json({ message: "No schedules found" });
    }
    res
      .status(200)
      .json({ schedules, message: "Schedules fetched successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while fetching schedules", error: err.message });
  }
};

export const deactivateSchedule = async (req, res) => {
  try {
    const user = req.user;
    const scheduleId = req.params.id;

    const schedule = await Schedule.findOne({
      _id: scheduleId,
      userId: user._id,
    });

    if (!schedule) {
      return res.status(404).json({ message: "schedule not found" });
    }
    schedule.isActive = false;
    await schedule.save();

    res
      .status(200)
      .json({ message: "schedule deactivated succesfully", schedule });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "error while deactivating schedule",
        error: err.message,
      });
  }
};

export const activateSchedule = async (req, res) => {
  try {
    const user = req.user;
    const scheduleId = req.params.id;

    const schedule = await Schedule.findOne({
      _id: scheduleId,
      userId: user._id,
    });

    if (!schedule) {
      return res.status(404).json({ message: "schedule not found" });
    }
    schedule.isActive = true;
    await schedule.save();

    res
      .status(200)
      .json({ message: "schedule activated succesfully", schedule });
  } catch (err) {
    res
      .status(500)
      .json({ message: "error while activating schedule", error: err.message });
  }
};

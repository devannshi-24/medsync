import Symptom from "../models/symptom.model.js";

export const addSymptom = async (req, res) => {
  try {
    const { symptom, severity, notes } = req.body;

    if (!symptom || !severity) {
      return res.status(400).json({
        success: false,
        message: "symptom and severity are required",
      });
    }
    const newSymptom = new Symptom({
      userId: req.user._id,
      symptom,
      severity,
      notes,
    });
    await newSymptom.save();

    return res.status(201).json({
      newSymptom,
      message: "Symptom logged successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error while adding symptom",
      error: err.message,
    });
  }
};

export const getSymptoms = async (req, res) => {
  try {
    const symptoms = await Symptom.find({
      userId: req.user._id,
    }).sort({ loggedAt: -1 });

    return res.status(200).json({
      count: symptoms.length,
      symptoms,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while fetching all symptoms",
      error: error.message,
    });
  }
};

export const getSymptomById = async (req, res) => {
  try {
    const symptom = await Symptom.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!symptom) {
      return res.status(404).json({
        message: "Symptom not found",
      });
    }

    return res.status(200).json({
      message: "symptom fetched successfully",
      symptom,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Get symptom error",
      error: error.message,
    });
  }
};

export const deleteSymptom = async (req, res) => {
  try {
    const symptom = await Symptom.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!symptom) {
      return res.status(404).json({
        success: false,
        message: "Symptom not found",
      });
    }

    await symptom.deleteOne();

    return res.status(200).json({
      message: "Symptom deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Delete symptom error",
      error: error.message,
    });
  }
};

export const updateSymptom = async (req, res) => {
  try {
    const { symptom, severity, notes } = req.body;
    const existingSymptom = await Symptom.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!existingSymptom) {
      return res.status(400).json({
        message: "symptom not found",
      });
    }

    if (symptom !== undefined) {
      existingSymptom.symptom = symptom;
    }

    if (severity !== undefined) {
      existingSymptom.severity = severity;
    }

    if (notes !== undefined) {
      existingSymptom.notes = notes;
    }

    await existingSymptom.save();

    return res.status(200).json({
      message: "Symptom updated successfully",
      symptom: existingSymptom,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Update symptom error",
      error: error.message,
    });
  }
};

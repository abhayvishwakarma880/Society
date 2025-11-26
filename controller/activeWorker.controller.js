// controllers/activeWorker.controller.js
import mongoose from "mongoose";
import { ActiveWorker } from "../model/availableWorker.model.js";

export const getActiveWorkers = async (req, res) => {
  try {
    const docs = await ActiveWorker.find({}, { worker: 1, _id: 0 });
    const ids = docs.map(d => String(d.worker));
    return res.json({ success: true, data: ids });
  } catch (err) {
    console.error("getActiveWorkers:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const addActiveWorker = async (req, res) => {
  try {
    const { workerId } = req.body;
    if (!workerId || !mongoose.Types.ObjectId.isValid(workerId)) {
      return res.status(400).json({ success: false, error: "Valid workerId required" });
    }

    const exists = await ActiveWorker.findOne({ worker: workerId });
    if (exists) return res.status(200).json({ success: true, message: "Already active", workerId });

    const doc = await ActiveWorker.create({ worker: workerId });
    return res.status(201).json({ success: true, workerId: String(doc.worker) });
  } catch (err) {
    // duplicate key race
    if (err.code === 11000) {
      return res.status(200).json({ success: true, message: "Already active", workerId: req.body.workerId });
    }
    console.error("addActiveWorker:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const removeActiveWorker = async (req, res) => {
  try {
    const workerId = req.params.workerId || req.body.workerId;
    if (!workerId || !mongoose.Types.ObjectId.isValid(workerId)) {
      return res.status(400).json({ success: false, error: "Valid workerId required" });
    }

    const removed = await ActiveWorker.findOneAndDelete({ worker: workerId });
    if (!removed) return res.status(404).json({ success: false, error: "Worker not active" });

    return res.json({ success: true, workerId });
  } catch (err) {
    console.error("removeActiveWorker:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// controllers/workerSchedule.controller.js
import mongoose from "mongoose";
import { WorkerSchedule } from "../model/workerSchedule.model.js";
import Registerdata from "../model/registration.model.js";

/* ---------- Helpers (no regex) ---------- */

// Accepts "YYYY-MM-DD" as a string, returns Date at UTC midnight or null if invalid
function parseDateStringNoRegex(s) {
  if (typeof s !== "string") return null;
  // split by dash
  const parts = s.split("-");
  if (parts.length !== 3) return null;

  const [ys, ms, ds] = parts;
  // lengths quick-check (not regex)
  if (ys.length !== 4 || ms.length < 1 || ms.length > 2 || ds.length < 1 || ds.length > 2) return null;

  const y = Number(ys);
  const m = Number(ms);
  const d = Number(ds);

  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;

  // basic ranges
  if (m < 1 || m > 12) return null;
  if (d < 1 || d > 31) return null;

  // construct date in UTC and verify components (to catch invalid days like Feb 30)
  const dateUtc = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
  if (isNaN(dateUtc.getTime())) return null;

  // verify that the components match (avoid JS auto-fix)
  if (dateUtc.getUTCFullYear() !== y) return null;
  if (dateUtc.getUTCMonth() !== (m - 1)) return null;
  if (dateUtc.getUTCDate() !== d) return null;

  return dateUtc;
}

// Accepts "HH:MM" as a string, returns normalized "HH:MM" or null if invalid
function parseTimeStringNoRegex(s) {
  if (typeof s !== "string") return null;
  const parts = s.split(":");
  if (parts.length !== 2) return null;
  const [hs, ms] = parts;
  // allow "9:5" or "09:05" etc. ensure numeric
  if (hs.length < 1 || hs.length > 2 || ms.length < 1 || ms.length > 2) return null;

  const h = Number(hs);
  const m = Number(ms);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;

  if (h < 0 || h > 23) return null;
  if (m < 0 || m > 59) return null;

  // return zero-padded version "HH:MM"
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${hh}:${mm}`;
}

/* ---------- Controllers ---------- */

// Create schedule
export const createSchedule = async (req, res) => {
  try {
    const { workerId, date, time } = req.body;

    if (!workerId || !mongoose.Types.ObjectId.isValid(workerId)) {
      return res.status(400).json({ success: false, error: "Valid workerId required" });
    }

    const parsedDate = parseDateStringNoRegex(date);
    if (!parsedDate) {
      return res.status(400).json({ success: false, error: "Invalid date. Use YYYY-MM-DD" });
    }

    const parsedTime = parseTimeStringNoRegex(time);
    if (!parsedTime) {
      return res.status(400).json({ success: false, error: "Invalid time. Use HH:MM (24-hour)" });
    }

    // console.log(workerId)
    const w = await Registerdata.findOne({_id:workerId})
    // console.log(w)

    const doc = await WorkerSchedule.create({
      worker: workerId,
      date: parsedDate,
      time: parsedTime,
      profile: w
    });

    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    console.error("createSchedule:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Get all (optional ?worker=... & ?date=YYYY-MM-DD)
export const getAllSchedules = async (req, res) => {
  try {
    const { worker, date } = req.query;
    const filter = {};

    if (worker && mongoose.Types.ObjectId.isValid(worker)) {
      filter.worker = worker;
    }

    if (date) {
      const parsedDate = parseDateStringNoRegex(date);
      if (!parsedDate) {
        return res.status(400).json({ success: false, error: "Invalid date filter. Use YYYY-MM-DD" });
      }
      // match exact UTC midnight
      filter.date = parsedDate;
    }

    const docs = await WorkerSchedule.find(filter).sort({ date: 1, time: 1 });
    return res.json({ success: true, data: docs });
  } catch (err) {
    console.error("getAllSchedules:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Get by id
export const getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Valid id required" });
    }
    const doc = await WorkerSchedule.findById(id);
    if (!doc) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, data: doc });
  } catch (err) {
    console.error("getScheduleById:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Update by id (workerId, date, time optional)
export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Valid id required" });
    }

    const { workerId, date, time } = req.body;
    const update = {};

    if (workerId) {
      if (!mongoose.Types.ObjectId.isValid(workerId)) {
        return res.status(400).json({ success: false, error: "Invalid workerId" });
      }
      update.worker = workerId;
    }

    if (date) {
      const parsedDate = parseDateStringNoRegex(date);
      if (!parsedDate) return res.status(400).json({ success: false, error: "Invalid date. Use YYYY-MM-DD" });
      update.date = parsedDate;
    }

    if (time) {
      const parsedTime = parseTimeStringNoRegex(time);
      if (!parsedTime) return res.status(400).json({ success: false, error: "Invalid time. Use HH:MM (24-hour)" });
      update.time = parsedTime;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ success: false, error: "Nothing to update" });
    }

    const updated = await WorkerSchedule.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error("updateSchedule:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Delete by id
export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Valid id required" });
    }
    const removed = await WorkerSchedule.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ success: false, error: "Not found" });
    return res.json({ success: true, data: removed });
  } catch (err) {
    console.error("deleteSchedule:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

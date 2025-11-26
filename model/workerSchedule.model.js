// models/workerSchedule.model.js
import mongoose from "mongoose";

const WorkerScheduleSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    required: true,
    index: true
  },
  date: {
    type: Date, // stored as UTC midnight
    required: true
  },
  time: {
    type: String, // "HH:MM" 24-hour string (stored as string)
    required: true
  }
}, { timestamps: true });

export const WorkerSchedule = mongoose.model("WorkerSchedule", WorkerScheduleSchema);

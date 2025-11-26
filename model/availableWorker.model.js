// models/activeWorker.model.js
import mongoose from "mongoose";

const ActiveWorkerSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  }
}, { timestamps: true });

ActiveWorkerSchema.index({ worker: 1 }, { unique: true });

export const ActiveWorker = mongoose.model("ActiveWorker", ActiveWorkerSchema);

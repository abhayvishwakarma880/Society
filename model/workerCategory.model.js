import mongoose from "mongoose";

const workerCategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

const WorkerCategory = mongoose.model("WorkerCategory", workerCategorySchema);
export default WorkerCategory;

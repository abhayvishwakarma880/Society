import mongoose from "mongoose";

const colonySchema = new mongoose.Schema(
  {
    colonyName: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

const Colony = mongoose.model("Colony", colonySchema);
export default Colony;

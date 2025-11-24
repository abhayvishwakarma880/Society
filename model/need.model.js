import mongoose from "mongoose";

const needSchema = new mongoose.Schema({
  selectColony: {
    type: String,
    required: false
  },
  selectCategory: {
    type: Array,
    required: false
  }
}, { timestamps: true })

const needData = mongoose.model('needData', needSchema)
export default needData
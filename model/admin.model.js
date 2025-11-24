import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  adminID: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
}, { timestamps: true })

const AdminData = mongoose.model('AdminData', adminSchema)
export default AdminData;
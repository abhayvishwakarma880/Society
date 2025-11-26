import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
  registrationID: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
  },
  fullName: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: Number,
    required: true
  },
  whatsappNumber: {
    type: Number,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  pincode: {
    type: Number,
    required: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    required: true,
    enum: ["society member", "society service"]
  },
  serviceCategory: {
    type: String,
    required: false
  },
  experience: {
    type: String,
    required: false
  },
  adharCard: {
    type: String,
    required: false
  },
  serviceCharge: {
    type: String,
    required: false
  },
  perHourCharge: {
    type: String,
    required: false
  },
}, { timestamps: true })

const Registerdata = mongoose.model('Registerdata', registerSchema)
export default Registerdata
import Registerdata from "../model/registration.model.js"
import bcrypt from "bcryptjs"

export const forgetPassword = async (req, res) => {
  try {
    const { registrationID } = req.params;
    const { mobileNumber, nPassword } = req.body

    const existMobile = await Registerdata.findOne({ mobileNumber })
    if (!existMobile) {
      return res.status(400).json({ message: "Wrong Mobile Number" })
    }
    const hashedNpassword = await bcrypt.hash(nPassword, 10);
    const forgetedPassword = await Registerdata.findOneAndUpdate({ registrationID }, { password: hashedNpassword }, { new: true })
    return res.status(200).json({ message: "New Password Created", data: forgetedPassword })
  }catch(error){
    return res.status(500).json({ message: "Internal Serer Error", error: error.message })
  }
}
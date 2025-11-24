import generateToken from "../config/token.js"
import AdminData from "../model/admin.model.js"
import bcrypt from 'bcryptjs'
import Registerdata from "../model/registration.model.js"

export const signup = async (req, res) => {
  try {
    const { adminID, name, email, password } = req.body
    if (!adminID || !name || !email || !password) {
      return res.status(400).json({ message: "All Fields Required !" })
    }
    const existID = await AdminData.findOne({ adminID: `AD${adminID}` })
    const existEmail = await AdminData.findOne({ email })
    if (existID) {
      return res.status(400).json({ message: "User already Exist !" })
    }
    if (existEmail) {
      return res.status(400).json({ message: "Email already Exist !" })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const admin = await AdminData.create({
      adminID: `AD${adminID}`,
      name,
      email,
      password: hashedPassword
    })
    return res.status(201).json({ message: "Admin created", admin })
  }
  catch (error) {
    return res.status(500).json({ message: "Internal Server Error !", error })
  }
}

export const login = async (req, res) => {
  try {
    const { adminID, password } = req.body
    const existAdmin = await AdminData.findOne({ adminID: `AD${adminID}` })
    if (!existAdmin) {
      return res.status(400).json({ message: "Admin not Found !" })
    }
    const passMatch = await bcrypt.compare(password, existAdmin.password)
    if (!passMatch) {
      return res.status(400).json({ message: "incorrect password !" })
    }
    let token;
    try {
      token = generateToken(existAdmin.adminID)
    } catch (error) {
      return res.status(500).json({ message: "Token not found !" })
    }
    return res.status(200).json({
      adminId: existAdmin.adminID,
      name: existAdmin.name,
      email: existAdmin.email,
      token
    })
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error !" })
  }
}

export const resetUserPassword = async (req, res) => {
  try {
    const { registrationID } = req.params;
    const user = await Registerdata.findOne({ registrationID })
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }
    const { newPassword } = req.body
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const resetedPassword = await Registerdata.findOneAndUpdate({ registrationID }, { password:hashedPassword }, { new: true })
    return res.status(200).json({ message: "Password reset", data:resetedPassword })
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message })
  }
}
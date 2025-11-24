import Registerdata from "../model/registration.model.js"
import bcrypt from 'bcryptjs'

const loginuser = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body
    const existMobile = await Registerdata.findOne({ mobileNumber })
    if (!existMobile) {
      return res.status(400).json({ message: "User Not Exist !" })
    }
    const passMatch = await bcrypt.compare(password, existMobile.password)
    if (!passMatch) {
      return res.status(400).json({ message: "incorrect password !" })
    }
    res.status(200).json({ message: "successfully login", existMobile })
    return res.status(200).json({ existMobile })
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error: error.message })
  }
}
export default loginuser

import req from "express/lib/request.js";
import cloudinary from "../config/cloudinary.js";
import Registerdata from "../model/registration.model.js";
import bcrypt from 'bcryptjs'

const registerController = async (req, res) => {
  try {
    const {
      registrationID,
      fullName,
      mobileNumber,
      whatsappNumber,
      email,
      password,
      address,
      pincode,
      role,
      serviceCategory,
      experience,
      serviceCharge,
      perHourCharge,
    } = req.body;

    const existID = await Registerdata.findOne({ registrationID: `UID${registrationID}` })
    const existEmail = await Registerdata.findOne({ email })
    const existMobile = await Registerdata.findOne({ mobileNumber })
    if (existID) {
      return res.status(400).json({ message: "User already Exist !" })
    }
    if (existEmail) {
      return res.status(400).json({ message: "Email already Exist !" })
    }
    if (existMobile) {
      return res.status(400).json({ message: "Mobile already Exist !" })
    }
    const mob = String(mobileNumber).trim();
    if (isNaN(Number(mob))) {
      return res.status(400).json({ message: "Mobile must contain digits only" });
    }
    if (mob.length !== 10) {
      return res.status(400).json({ message: "Mobile number must be 10 digits" });
    }
    const firstDigit = mob[0];
    if (firstDigit !== "6" && firstDigit !== "7" && firstDigit !== "8" && firstDigit !== "9") {
      return res.status(400).json({ message: "Mobile number must start with 6, 7, 8, or 9" });
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    let profileImageUrl = "";
    if (req.files?.profileImage) {
      const uploadProfile = await cloudinary.uploader.upload(
        req.files.profileImage[0].path,
        { folder: "profileImages" }
      );
      profileImageUrl = uploadProfile.secure_url;
    }

    let adharCardUrl = "";
    if (req.files?.adharCard) {
      const uploadAdhar = await cloudinary.uploader.upload(
        req.files.adharCard[0].path,
        { folder: "adharCards" }
      );
      adharCardUrl = uploadAdhar.secure_url;
    }

    let saveData = {
      registrationID: `UID${registrationID}`,
      fullName,
      mobileNumber,
      whatsappNumber,
      email,
      password: hashedPassword,
      address,
      pincode,
      role,
      profileImage: profileImageUrl,
    };

    if (role === "society service") {
      saveData.serviceCategory = serviceCategory;
      saveData.experience = experience;
      saveData.serviceCharge = serviceCharge;
      saveData.perHourCharge = perHourCharge;
      saveData.adharCard = adharCardUrl;
    }

    // await needData.create({ selectCategory: saveData.serviceCategory })
    const newUser = new Registerdata(saveData);
    await newUser.save();

    return res.status(200).json({
      message: "Registration successful",
      data: newUser,
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default registerController;


export const isBlockedController = async (req, res) => {
  try {
    const { registrationID } = req.params
    const user = await Registerdata.findOne({ registrationID });

    if (!user) {
      return res.status(404).json({ message: "User not found !" });
    }

    const { isBlocked } = req.body

    const isBlockedUser = await Registerdata.findByIdAndUpdate({ registrationID }, { isBlocked })
    return res.status(201).json({ message: "user blocked", data: isBlockedUser })

  } catch (error) {
    return res.status(500).json({ message: "Inernal Server Error", error: error.message })
  }
}
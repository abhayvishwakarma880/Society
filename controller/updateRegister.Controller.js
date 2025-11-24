import cloudinary from "../config/cloudinary.js";
import Registerdata from "../model/registration.model.js";

const updateRegisterController = async (req, res) => {
  try {
    const { registrationID } = req.params;

    const user = await Registerdata.findOne({
      registrationID
    });


    if (!user) {
      return res.status(404).json({ message: "User not found !" });
    }

    const {
      fullName,
      mobileNumber,
      whatsappNumber,
      email,
      address,
      pincode,
      role,
      serviceCategory,
      experience,
      serviceCharge,
      perHourCharge,
    } = req.body;

    let profileImageUrl = user.profileImage;
    if (req.files?.profileImage) {
      const uploadedProfile = await cloudinary.uploader.upload(
        req.files.profileImage[0].path,
        { folder: "profileImages" }
      );
      profileImageUrl = uploadedProfile.secure_url;
    }

    let adharCardUrl = user.adharCard;
    if (req.files?.adharCard) {
      const uploadedAdhar = await cloudinary.uploader.upload(
        req.files.adharCard[0].path,
        { folder: "adharCards" }
      );
      adharCardUrl = uploadedAdhar.secure_url;
    }

    let updateData = {
      fullName,
      mobileNumber,
      whatsappNumber,
      email,
      address,
      pincode,
      role,
      profileImage: profileImageUrl,
    };

    if (role === "society service") {
      updateData.serviceCategory = serviceCategory;
      updateData.experience = experience;
      updateData.serviceCharge = serviceCharge;
      updateData.perHourCharge = perHourCharge;
      updateData.adharCard = adharCardUrl;
    } else {
      updateData.serviceCategory = undefined;
      updateData.experience = undefined;
      updateData.serviceCharge = undefined;
      updateData.perHourCharge = undefined;
      updateData.adharCard = undefined;
    }

    const updatedUser = await Registerdata.findOneAndUpdate(
      { registrationID },
      updateData,
      { new: true }
    );

    return res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export default updateRegisterController;

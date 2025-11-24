import carouselData from "../model/carousel.model.js";
import cloudinary from "../config/cloudinary.js";

const carouselController = async (req, res) => {
  try {
    let carouselImageUrl = "";

    if (req.files?.image) {
      const uploadImage = await cloudinary.uploader.upload(
        req.files.image[0].path,
        { folder: "carouselImages" }
      );

      carouselImageUrl = uploadImage.secure_url;
    }

    const savedImage = await carouselData.create({
      image: carouselImageUrl,
    });

    return res.status(200).json({
      message: "Image uploaded successfully",
      data: savedImage,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default carouselController;

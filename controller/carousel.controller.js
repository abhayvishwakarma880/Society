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


export const deleteCarouselController = async (req, res) => {
  try {
    const { id } = req.params;

    // Find image from DB
    const imageData = await carouselData.findById(id);
    if (!imageData) {
      return res.status(404).json({
        message: "Carousel image not found",
      });
    }

    // ---- Delete from Cloudinary ----
    if (imageData.image) {
      // extract public_id from URL
      const parts = imageData.image.split("/");
      const imageName = parts.pop().split(".")[0]; // filename without extension
      const folder = parts.slice(parts.indexOf("carouselImages")).join("/");

      const publicId = `${folder}/${imageName}`;

      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log("Cloudinary delete error:", err.message);
      }
    }

    // ---- Delete from database ----
    await carouselData.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Carousel image deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllCarouselController = async (req, res) => {
  try {
    // fetch all documents, newest first
    const items = await carouselData.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      message: "Carousel images fetched",
      data: items,
    });
  } catch (error) {
    console.error("getAllCarouselController:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
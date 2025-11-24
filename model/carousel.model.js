import mongoose from "mongoose";

const carouserSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  }
})

const carouselData = mongoose.model('carouselData', carouserSchema)
export default carouselData
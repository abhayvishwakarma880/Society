import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ""
  }
});

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true
    },
    subcategories: [subCategorySchema]
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;

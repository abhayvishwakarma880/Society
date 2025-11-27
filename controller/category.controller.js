import Category from "../model/category.model.js";
import cloudinary from "../config/cloudinary.js";

export const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: "Category name required" });
    }

    const exist = await Category.findOne({ categoryName });
    if (exist) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCat = new Category({ categoryName });
    await newCat.save();

    return res.status(200).json({
      message: "Category created",
      data: newCat
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addSubCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Subcategory name required" });
    }

    let imageUrl = "";
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, { folder: "subcategoryImages" });
      imageUrl = upload.secure_url;
    }

    const category = await Category.findOne({_id:categoryId});

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.subcategories.push({
      name,
      image: imageUrl
    });

    await category.save();

    return res.status(200).json({
      message: "Subcategory added",
      data: category
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const { categoryId, subId } = req.params;
    const { name, image } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).send({ message: "Category not found" });

    const subCat = category.subcategories.id(subId);
    if (!subCat) return res.status(404).send({ message: "Subcategory not found" });

    subCat.name = name || subCat.name;
    subCat.image = image || subCat.image;

    await category.save();

    res.send({ message: "Subcategory updated", data: category });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// ===============================
// Delete Subcategory
// ===============================
export const deleteSubCategory = async (req, res) => {
  try {
    const { categoryId, subId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).send({ message: "Category not found" });

    const subCat = category.subcategories.id(subId);
    if (!subCat) return res.status(404).send({ message: "Subcategory not found" });

    subCat.deleteOne();
    await category.save();

    res.send({ message: "Subcategory deleted", data: category });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// ===============================
// Get All Categories
// ===============================
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.send({ data: categories });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// ===============================
// Get Category by ID
// ===============================
export const getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);

    if (!category) return res.status(404).send({ message: "Category not found" });

    res.send({ data: category });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const deleted = await Category.findByIdAndDelete(categoryId);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ 
      message: "Category deleted successfully", 
      deleted 
    });

  } catch (error) {
    return res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};


export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const updated = await Category.findByIdAndUpdate(
      categoryId,
      { categoryName },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      data: updated,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


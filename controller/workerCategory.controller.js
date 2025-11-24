import WorkerCategory from "../model/workerCategory.model.js";

// Add Category
export const addWorkerCategory = async (req, res) => {
  try {
    const cat = new WorkerCategory(req.body);
    const saved = await cat.save();
    res.status(201).json({ message: "Worker Category added", data: saved });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// Get All
export const getWorkerCategories = async (req, res) => {
  try {
    const list = await WorkerCategory.find();
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// Update
export const updateWorkerCategory = async (req, res) => {
  try {
    const updated = await WorkerCategory.findByIdAndUpdate(
      req.params.categoryId,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Worker Category not found" });
    }

    res.status(200).json({
      message: "Updated successfully",
      data: updated
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// Delete
export const deleteWorkerCategory = async (req, res) => {
  try {
    const deleted = await WorkerCategory.findByIdAndDelete(req.params.categoryId);

    if (!deleted) {
      return res.status(404).json({ message: "Worker Category not found" });
    }

    res.status(200).json({
      message: "Deleted successfully",
      data: deleted
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

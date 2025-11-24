import Colony from "../model/colony.model.js";
import WorkerCategory from "../model/workerCategory.model.js";

// Add Colony
export const addColony = async (req, res) => {
  try {
    const colony = new Colony(req.body);
    const saved = await colony.save();
    res.status(201).json({ message: "Colony added successfully", data: saved });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// Get All Colonies
export const getColonies = async (req, res) => {
  try {
    const list = await Colony.find();
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// Update Colony
export const updateColony = async (req, res) => {
  try {
    const updated = await Colony.findByIdAndUpdate(
      req.params.colonyId,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Colony not found" });
    }

    res.status(200).json({
      message: "Colony updated successfully",
      data: updated
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// Delete Colony
export const deleteColony = async (req, res) => {
  try {
    const deleted = await Colony.findByIdAndDelete(req.params.colonyId);

    if (!deleted) {
      return res.status(404).json({ message: "Colony not found" });
    }

    res.status(200).json({
      message: "Colony deleted successfully",
      data: deleted
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};


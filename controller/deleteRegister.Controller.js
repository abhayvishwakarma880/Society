import Registerdata from "../model/registration.model.js";

const deleteRegisterController = async (req, res) => {
  try {
    const { registrationID } = req.params;

    const deletedUser = await Registerdata.findOneAndDelete({
      registrationID
    });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found !" });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      data: deletedUser,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export default deleteRegisterController;

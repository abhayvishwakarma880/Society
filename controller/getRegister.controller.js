import Registerdata from "../model/registration.model.js";

const getRegisterUser = async (req, res) => {
  try {
    const { registrationID, fullName } = req.query;

    if (registrationID) {
      const user = await Registerdata.findOne({ registrationID });

      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      return res.status(200).json({data: user});
    }
    if (fullName) {
      const user = await Registerdata.findOne({ fullName: fullName });

      if (!user) {
        return res.status(404).json({ message: "No user found with this name!" });
      }

      return res.status(200).json({data: user});
    }
    const allUsers = await Registerdata.find();

    return res.status(200).json({data: allUsers});

  } catch (error) {
    return res.status(500).json({message: "Server error",error: error.message});
  }
};

export default getRegisterUser;

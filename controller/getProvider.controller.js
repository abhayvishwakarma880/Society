import Registerdata from "../model/registration.model.js"

export const getProviders = async (req, res) => {
  try {
    const data = await Registerdata.find()
    const a = data.filter((i)=> {
      if(i.serviceCategory){
        return true
      }
    })
    return res.status(200).json({ a })
  } catch (error) {
    return res.status(500).json({ message: "Intenal server error !", error: error.message })
  }
}


export const getProvider = async (req, res) => {
  try {
    const { serviceCategory } = req.query;

    // if (registrationID) {
    //   const user = await Registerdata.findOne({ registrationID });

    //   if (!user) {
    //     return res.status(404).json({ message: "User not found!" });
    //   }

    //   return res.status(200).json({data: user});
    // }
    if (serviceCategory) {
      const user = await Registerdata.findOne({ serviceCategory: serviceCategory });

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


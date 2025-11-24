import needData from "../model/need.model.js"
import Registerdata from "../model/registration.model.js"

export const needController = async (req, res) => {
  try {
    const { selectColony } = req.body
    const existNeed = await needData.findOne({selectColony})
    if(existNeed){
      return res.status(400).json({message:"Colony Allready Exist"})
    }

    const servicesData = await Registerdata.find()
    let d = servicesData.filter((i)=>{
      if(i.serviceCategory){
        return true
      }
    })
    const e = d.map((i)=>{
      return i.serviceCategory
    })
    // return res.status(200).json(e)
    const saveNeed = {
      selectColony,
      selectCategory:e
    }
    const newNeed = new needData(saveNeed)
    await newNeed.save()

    return res.status(200).json({message:"Need Added", newNeed})
    // console.log(selectCategory[2].serviceCategory)
    // const saveNeed = await needData.create({selectColony:selectColony})
    // return res.status(200).json({message:"Colony Added", saveNeed})
  } catch (error) {
    return res.status(500).json({ message: "Internal server errro", error: error.message })
  }
}
export default needController

export const getNeed = async (req,res) => {
  const data = await needData.find()
  return res.status(200).json({data})
}

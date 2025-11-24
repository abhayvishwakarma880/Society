import express, { Router } from 'express'
import { login, resetUserPassword, signup } from '../controller/admin.controller.js'
import upload from '../middlewares/multer.js'
import registerController from '../controller/register.controller.js'
import updateRegisterController from '../controller/updateRegister.Controller.js'
import deleteRegisterController from '../controller/deleteRegister.Controller.js'
import getRegisterUser from '../controller/getRegister.controller.js'
import loginuser from '../controller/loginUser.controller.js'
import { verifyAdminToken } from '../middlewares/verifyAdminToken.js'
import { forgetPassword } from '../controller/forgetPassword.controller.js'
import carouselController from '../controller/carousel.controller.js'
import { addCategory, addSubCategory, deleteCategory, deleteSubCategory, getAllCategories, getCategoryById, updateCategory, updateSubCategory } from '../controller/category.controller.js'
import needController, { getNeed } from '../controller/need..controller.js'
import {
  addWorkerCategory,
  getWorkerCategories,
  updateWorkerCategory,
  deleteWorkerCategory
} from "../controller/workerCategory.controller.js";
import {
  addColony,
  getColonies,
  updateColony,
  deleteColony,
} from "../controller/colony.controller.js";
import { getProvider, getProviders } from '../controller/getProvider.controller.js'

const appRoute = express.Router()

appRoute.post('/signup', signup)
appRoute.post('/login', login)
appRoute.post("/registerUser", upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "adharCard", maxCount: 1 },]), registerController);
appRoute.put("/updateUser/:registrationID",verifyAdminToken,upload.fields([{ name: "profileImage", maxCount: 1 },{ name: "adharCard", maxCount: 1 },]),updateRegisterController);
appRoute.delete('/deleteUser/:registrationID',verifyAdminToken, deleteRegisterController)
appRoute.get('/getUser', getRegisterUser)
appRoute.post('/loginUser', loginuser)
appRoute.patch('/userResetPassword/:registrationID',verifyAdminToken, resetUserPassword)
appRoute.patch('/forgetPassword/:registrationID', forgetPassword)
appRoute.post("/carouselImage",verifyAdminToken,upload.fields([{ name: "image", maxCount: 1 }]),carouselController);
appRoute.post("/category",verifyAdminToken, addCategory);
appRoute.post("/category/:categoryId/subcategory",verifyAdminToken,upload.single("image"),addSubCategory);
appRoute.put("/category/:categoryId/subcategory/:subId",verifyAdminToken,upload.single("image"), updateSubCategory);
appRoute.delete("/category/:categoryId/subcategory/:subId",verifyAdminToken, deleteSubCategory);
appRoute.get("/getAllCategory",verifyAdminToken, getAllCategories);
appRoute.get("/singleCategory/:categoryId",verifyAdminToken, getCategoryById);
appRoute.delete("/deleteCategory/:categoryId",verifyAdminToken, deleteCategory);
appRoute.put("/updateCategory/:categoryId",verifyAdminToken, updateCategory);
appRoute.post("/needAdd",needController)
appRoute.get("/getNeed",getNeed)


// Colony Routes
appRoute.post("/colony", addColony);
appRoute.get("/colony", getColonies);
appRoute.put("/colony/:colonyId", updateColony);
appRoute.delete("/colony/:colonyId", deleteColony);

// Worker Category Routes
appRoute.post("/worker-category", addWorkerCategory);
appRoute.get("/worker-category", getWorkerCategories);
appRoute.put("/worker-category/:categoryId", updateWorkerCategory);
appRoute.delete("/worker-category/:categoryId", deleteWorkerCategory);

appRoute.get("/getProviders", getProviders);
appRoute.get("/getProvider", getProvider);


export default appRoute
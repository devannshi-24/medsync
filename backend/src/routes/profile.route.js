import express from "express"
import { getProfile } from "../controllers/profile.controller.js";
import { updateProfile } from "../controllers/profile.controller.js";
import isAuth  from "../middleware/isAuth.js";

const profileRouter= express.Router();

profileRouter.get("/",isAuth,getProfile)
profileRouter.put("/",isAuth,updateProfile)

export default profileRouter
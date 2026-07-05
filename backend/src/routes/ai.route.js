import express from "express"
import isAuth from "../middleware/isAuth.js"
import { chat } from "../controllers/ai.controller.js"


const AIRouter=express.Router()

AIRouter.post("/chat",isAuth,chat)

export default AIRouter
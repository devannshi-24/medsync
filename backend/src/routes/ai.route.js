import express from "express"
import isAuth from "../middleware/isAuth.js"
import { chat,newChat } from "../controllers/ai.controller.js"


const AIRouter=express.Router()

AIRouter.post("/chat",isAuth,chat)
AIRouter.delete("/new-chat",isAuth,newChat)

export default AIRouter
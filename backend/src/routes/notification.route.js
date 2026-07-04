import express from "express";
import isAuth from "../middleware/isAuth.js";
import { sendTestNotification } from "../controllers/notification.controller.js";

const notificationRouter = express.Router();

notificationRouter.post(
    "/test",
    isAuth,
    sendTestNotification
);

export default notificationRouter;
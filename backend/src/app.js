import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.route.js";   
import profileRouter from "./routes/profile.route.js"; 
import medicineRouter from "./routes/medicine.route.js";
import cookieParser from "cookie-parser";
import scheduleRouter from "./routes/schedule.route.js";
import doseLogRouter from "./routes/doselog.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import symptomRouter from "./routes/symptom.route.js";
import deviceRouter from "./routes/device.route.js";
import notificationRouter from "./routes/notification.route.js";
import AIRouter from "./routes/ai.route.js";






const app= express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true   
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter)
app.use("/api/medicine",medicineRouter)
app.use("/api/schedule", scheduleRouter) 
app.use("/api/doselog", doseLogRouter)
app.use("/api/dashboard",dashboardRouter)
app.use("/api/symptom",symptomRouter)
app.use("/api/device",deviceRouter)
app.use("/api/notification",notificationRouter)
app.use("/api/ai",AIRouter)





// app.get("/",(req,res)=>{
//     res.send("API is running....");
// })




export { app }
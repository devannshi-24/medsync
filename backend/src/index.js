import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";
dotenv.config();
import startMedicineReminderJob from "./jobs/medicineReminder.js";
import "./config/firebase.js";
import connectDB from "./config/db.js";




const PORT= process.env.PORT || 5000;
 
import { app } from "./app.js";


connectDB();

startMedicineReminderJob();



app.listen(PORT,()=>{
    console.log("Server is running on port ",PORT);
})

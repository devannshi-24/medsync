import Device from "../models/device.model.js";
import { sendNotification } from "../services/notification.service.js";

export const sendTestNotification = async (req, res) => {
    try {
        const user = req.user;

        const device = await Device.findOne({
            userId: user._id,
            platform: "web"
        });

        if (!device) {
            return res.status(404).json({
                message: "No registered device found"
            });
        }

        const response = await sendNotification(
            device.fcmToken,
            "MedSync",
            "🎉 Your first push notification!",
            {
                scheduleId:"test123"
            }
        );

        return res.status(200).json({
            message: "Notification sent",
            response
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to send notification",
            error: error.message
        });
    }
};
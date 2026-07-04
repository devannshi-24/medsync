import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        fcmToken: {
            type: String,
            required: true
        },

        platform: {
            type: String,
            enum: ["web", "android"],
            default: "web"
        }
    },
    {
        timestamps: true
    }
);

const Device = mongoose.model("Device", deviceSchema);

export default Device;
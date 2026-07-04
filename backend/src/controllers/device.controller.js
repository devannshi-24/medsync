import Device from "../models/device.model.js";
export const registerDevice = async (req, res) => {
  try {
    // console.log("registerDevice called");
    const user = req.user;
    const { fcmToken, platform } = req.body;
    // console.log(req.body);
    if (!fcmToken) {
      return res.status(400).json({
        message: "FCM token is required",
      });
    }
    //   console.log("Before findOne");
      let device = await Device.findOne({
        userId: user._id,
        platform: platform || "web",
      });
      console.log("After findOne", device);
      if (device) {
        device.fcmToken = fcmToken;
        await device.save();
      } else {
        device = await Device.create({
          userId: user._id,
          fcmToken,
          platform: platform || "web",
        });

      }
    //   console.log("Sending response");
      return res.status(200).json({
        message: "Device registered successfully",
      });
    }
   catch (error) {
    return res.status(500).json({
      message: "Error registering device",
      error: error.message,
    });
  }
};

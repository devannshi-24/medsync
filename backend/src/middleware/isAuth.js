import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuth = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);
    console.log("Cookie header:", req.headers.cookie);
    // console.log("isAuth middleware");
    const token =
      req.cookies?.token || req.headers?.authorization?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no token provided" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    // console.log("Authenticated");
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: error.message });
  }
};

export default isAuth;

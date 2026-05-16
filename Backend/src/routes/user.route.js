import { Router } from "express";
import {
  logOut,
  loginUser,
  createUser,
  generateAccessAndRefreshToken,
  sendOtp,
  changePassword,
  updateUser,
  updateAvatar,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import otpLimiter from "../utils/OtpLimiter.js";
const routes = Router();
console.log("routes");


routes.route("/send-otp").post(otpLimiter,sendOtp);

routes.route("/signup").post(createUser);
routes.route("/signin").post(loginUser);
routes.route("/signout").get(verifyJwt, logOut);

routes.route("/update-password").patch(verifyJwt, changePassword);
routes.route("/update-user").patch(verifyJwt, updateUser);
routes.route("/update-avatar").patch(verifyJwt, upload.single("avatar"), updateAvatar);
routes.route("/current-user").get(verifyJwt,getCurrentUser);

export default routes;

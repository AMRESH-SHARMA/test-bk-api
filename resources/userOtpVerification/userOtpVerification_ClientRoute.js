import { Router } from "express";
const router = Router();
import multer from "multer";
const upload = multer({ dest: 'uploads/' })

import {
  sendUserOtp,
  verifyOtp
} from "./userOtpVerificationController.js"

router.route("/user/otp").post(sendUserOtp);

router.route("/user/otp").put(verifyOtp);

export default router;
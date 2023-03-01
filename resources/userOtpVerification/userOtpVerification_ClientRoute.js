import { Router } from "express";
const router = Router();
import multer from "multer";
const upload = multer({ dest: 'uploads/' })

import {
  sendUserOtp,
} from "./userOtpVerificationController.js"

router.route("/user/otp").post(sendUserOtp);

export default router;
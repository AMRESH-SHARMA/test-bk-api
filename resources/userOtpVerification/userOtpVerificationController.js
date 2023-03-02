import UserOtpVerification from "./userOtpVerificationModel.js"
import { sendResponse } from "../../util/sendResponse.js"
import { generateOtp } from "../../util/others.js"

//Send OTP during registration
export const sendUserOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Generate OTP
    const otp = generateOtp()

    const emailInUse = await UserOtpVerification.findOne({ email: email })
      .where('reserved').equals(true)
      .countDocuments();
    if (emailInUse) {
      return sendResponse(201, true, 'email is already registered', res)
    }

    const exist = await UserOtpVerification.findOne({ email: email }).countDocuments();
    if (exist) {
      console.log(exist);
      await UserOtpVerification.findOneAndUpdate({ email, otp })
      return sendResponse(201, true, otp, res)
    }

    await UserOtpVerification.create({ email, otp })
    // await sendOtpEmail();
    sendResponse(201, true, otp, res)
  } catch (e) {
    console.log(e);
    sendResponse(400, false, e.message, res)
  }
};

//Verify OTP
export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await UserOtpVerification.findOne({ email: email }).where('otp').equals(otp);
    if (!user) {
      return sendResponse(400, false, 'invalid otp', res);
    }
    let timeDiff = parseInt((new Date() - user.updatedAt) / (1000 * 60));
    if (timeDiff > 5) {
      return sendResponse(400, false, 'otp expired', res);
    }

    user.verified = true;
    user.save();
    sendResponse(201, true, 'otp verified', res);
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
};


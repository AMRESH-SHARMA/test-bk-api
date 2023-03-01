import UserOtpVerification from "./userOtpVerificationModel.js"
import { sendResponse } from "../../util/sendResponse.js"
import { newToken } from '../../util/jwt.js'

//Send OTP during registration
export const sendUserOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const exist = await UserOtpVerification.findOne({ email: email }).countDocuments();
    if (exist) {
      return sendResponse(400, false, 'email already in use', res)
    }
    // Generate OTP
    const OTP = Math.floor(1000 + Math.random() * 9000);
    console.log(OTP);
    // Save OTP on db with email
    await UserOtpVerification.create({ email, OTP })
    // send OTP
    // await sendOtpEmail();
    sendResponse(201, true, OTP, res)
  } catch (e) {
    console.log(e);
    if (e.code) {
      return sendResponse(400, false, `${Object.keys(e.keyValue)} already in use`, res)
    }
    sendResponse(400, false, e.message, res)
  }
};

//Verify OTP
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).where('approved').equals(true).select("+password");
    if (!user) {
      return sendResponse(400, false, 'user not found with this email', res);
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return sendResponse(400, false, 'password incorrect', res);
    }

    const userData = await User.findOne({ email }).populate('address');
    const result = userData
    const token = newToken(result)
    const options = {
      expires: new Date(
        Date.now() + 20 * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    res.cookie("token", token, options)
    sendResponse(201, true, { token, result }, res);
  } catch (e) {
    sendResponse(400, false, e.message, res)
  }
};


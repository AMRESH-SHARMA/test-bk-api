import mongoose from "mongoose"

const userOtpVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    maxLength: 100,
    unique: true,
  },
  otp: {
    type: Number,
    trim: true,
    default: null,
  },
  verified: {
    type: Boolean,
    default: "false",
  },
}, { timestamps: true });

// Compare OTP
userOtpVerificationSchema.methods.compareOtp = async function (password) {
  // return await bcrypt.compare(password, this.password);
  return true;
};

const UserOtpVerificationModel = mongoose.model("UserOtpVerification", userOtpVerificationSchema);
export default UserOtpVerificationModel;
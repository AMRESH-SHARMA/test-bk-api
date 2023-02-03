import mongoose from "mongoose"
import bcrypt from "bcrypt"
import crypto from "crypto"

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    maxLength: 100,
  },
  city: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    select: false,
  },
  image:
  {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  role: {
    type: String,
    default: "admin",
  },
  approved: {
    type: Boolean,
    default: "false",
  },
  otp: {
    type: Number,
    default: null,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Password bcrypt before saving into db
adminSchema.pre("save", async function (next) {
  try {
    const hash = await bcrypt.hash(this.password, 8);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});


// Compare Password
adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating   Reset Token
adminSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding reset PasswordToken to adminSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //expire password time
  // console.log(this.resetPasswordToken)
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;//15 minut

  return resetToken;
};

const AdminModel = mongoose.model("Admin", adminSchema);
export default AdminModel;
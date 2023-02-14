import mongoose from "mongoose"
import bcrypt from "bcrypt"
import crypto from "crypto"

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true,
    unique: true,
  },
  fullName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    maxLength: 100,
    unique: true,
  },
  phone: {
    type: Number,
    trim: true,
    unique: true,
    sparse: true
  },
  address: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAddress",
    }
  ],
  password: {
    type: String,
    trim: true,
    select: false,
  },
  image: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  approved: {
    type: Boolean,
    default: "true",
  },
  otp: {
    type: Number,
    trim: true,
    default: null,
  },
  booksAdded: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    }
  ],
  booksMarked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    }
  ],
  cart: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      noOfDays: { type: Number, trim: true, minLength: 3, required: true },
    },
  ],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating   Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding reset PasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //expire password time
  // console.log(this.resetPasswordToken)
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;//15 minut

  return resetToken;
};

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
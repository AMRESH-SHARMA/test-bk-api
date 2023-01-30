import mongoose from "mongoose"
import bcrypt from "bcrypt"
import crypto from "crypto"

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
  },
  phone: {
    type: Number,
    unique: true,
    sparse: true
  },
  city: {
    type: String,
  },
  password: {
    type: String,
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
  },
  approved: {
    type: Boolean,
    default: "false",
  },
  otp: {
    type: Number,
    default: null,
  },
  booksAdded: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    }
  ],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Password bcrypt before saving into db
userSchema.pre("save", async function (next) {
  try {
    const hash = await bcrypt.hash(this.password, 8);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

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
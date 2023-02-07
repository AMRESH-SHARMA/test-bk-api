import mongoose from "mongoose"

const userAddressSchema = new mongoose.Schema({
  addressLine: {
    type: String,
    trim: true,
    required: true,
    maxLength: 50,
  },
  landmark: {
    type: String,
    trim: true,
    maxLength: 50,
  },
  city: {
    type: String,
    trim: true,
    required: true,
    maxLength: 20,
  },
  state: {
    type: String,
    trim: true,
    required: true,
    maxLength: 20,
  },
  zipCode: {
    type: Number,
    trim: true,
    required: true,
  },
  country: {
    type: String,
    trim: true,
    required: true,
    maxLength: 20,
    default: "India",
  },
}, { timestamps: true });

const UserAddressModel = mongoose.model("UserAddress", userAddressSchema);
export default UserAddressModel;
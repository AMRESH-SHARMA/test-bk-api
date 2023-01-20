import mongoose from "mongoose"
const addressSchema = new mongoose.Schema({
  companyName: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  pinCode: {
    type: Number,
  },
  gstin: {
    type: Number,
  },
  website: {
    type: String,
  },
  phone: {
    type: Number,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
  },
}, { timestamps: true });

const addressModel = mongoose.model("Address", addressSchema);
export default addressModel;
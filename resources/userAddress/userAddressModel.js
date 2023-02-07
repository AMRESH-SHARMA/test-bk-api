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

userAddressSchema.pre('save', function (next) {
  try {
    this.addressLine = this.addressLine.split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
    this.city = this.city.split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
    this.state = this.state.split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
    this.country = this.country.split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
    if (this.landmark) {
      this.landmark = this.landmark.split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    }
    next()
  } catch (e) {
    console.log(e);
  }
})

const UserAddressModel = mongoose.model("UserAddress", userAddressSchema);
export default UserAddressModel;
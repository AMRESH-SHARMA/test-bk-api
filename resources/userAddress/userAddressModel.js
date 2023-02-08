import mongoose from "mongoose"

const userAddressSchema = new mongoose.Schema({
  addressLine1: {
    type: String,
    trim: true,
    maxLength: 50,
  },
  addressLine2: {
    type: String,
    trim: true,
    maxLength: 50,
  },
  type: {
    type: String,
    trim: true,
    maxLength: 20,
  },
  landmark: {
    type: String,
    trim: true,
    maxLength: 50,
  },
  city: {
    type: String,
    trim: true,
    maxLength: 20,
  },
  state: {
    type: String,
    trim: true,
    maxLength: 20,
  },
  zipCode: {
    type: Number,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
    maxLength: 20,
    default: "India",
  },
}, { timestamps: true });

userAddressSchema.pre('save', function (next) {
  try {
    if (this.addressLine1) {
      this.addressLine1 = this.addressLine1.split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    }
    if (this.addressLine2) {
      this.addressLine2 = this.addressLine2.split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    }
    if (this.city) {
      this.city = this.city.split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    }
    if (this.state) {
      this.state = this.state.split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    }
    if (this.country) {
      this.country = this.country.split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    }
    if (this.landmark) {
      this.landmark = this.landmark.split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    }
    if (this.type) {
      this.type = this.type.split(' ')
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
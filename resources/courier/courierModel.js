import mongoose from "mongoose"

const courierSchema = new mongoose.Schema({
  courierName: {
    type: String,
    trim: true,
    unique: true,
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
  address: {
    type: String,
    trim: true
  },
  image: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  approved: {
    type: Boolean,
    default: "true",
  },
  // booksAdded: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Book",
  //   }
  // ],
  // booksMarked: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Book",
  //   }
  // ],
  // cart: [
  //   {
  //     itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  //     noOfDays: { type: Number, trim: true, minLength: 3, required: true },
  //   },
  // ],
  // order: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Order",
  //   }
  // ],
}, { timestamps: true });

const CourierModel = mongoose.model("Courier", courierSchema);
export default CourierModel;
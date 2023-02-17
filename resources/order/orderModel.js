import mongoose from "mongoose"
const orderSchema = new mongoose.Schema({
  address: {
    addressLine1: { type: String },
    addressLine2: { type: String },
    landmark: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: Number },
    country: { type: String },
  },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      noOfDays: { type: Number, required: true, trim: true },
      rentPerDay: { type: Number, required: true, trim: true },
      amount: { type: Number, required: true, trim: true }
    },
  ],
  internetHandlingFees: { type: Number, required: true, trim: true },
  deliveryFees: { type: Number, required: true, trim: true },
  serviceFees: { type: Number, required: true, trim: true },
  totalAmountBeforeCharges: { type: Number, required: true, trim: true },
  totalAmountAfterCharges: { type: Number, required: true, trim: true },
  paymentStatus: { type: String, enum: ["success", "failed"] },
  status: {
    type: String,
    enum: [
      "new",
      "processing",
      "dispatched",
      "delivered",
      "cancelled",
      "returned",
    ],
    default: "new",
  },
  statusTimeline: {
    new: { type: Date },
    processing: { type: Date },
    dispatched: { type: Date },
    delivered: { type: Date },
    cancelled: { type: Date },
    returned: { type: Date },
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
}, { timestamps: true });

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
import mongoose from "mongoose"
const orderSchema = new mongoose.Schema({
  order_id: { type: String },
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
  paymentMode: { type: String, enum: ["cod", "debitCard", "creditCard"] },
  internetHandlingFees: { type: Number, required: true, trim: true },
  deliveryFees: { type: Number, required: true, trim: true },
  serviceFees: { type: Number, required: true, trim: true },
  totalAmountBeforeCharges: { type: Number, required: true, trim: true },
  totalAmountAfterCharges: { type: Number, required: true, trim: true },

  payment: { type: String, enum: ["success", "failed"] },
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
  // status_timeline: {
  //   new: { type: Date },
  //   processing: { type: Date },
  //   dispatched: { type: Date },
  //   delivered: { type: Date },
  //   cancelled: { type: Date },
  //   returned: { type: Date },
  // },
}, { timestamps: true });

// orderSchema.pre('save', function (next) {
//   this.totalAmount = this.clicks / this.views
//   next();
// });

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
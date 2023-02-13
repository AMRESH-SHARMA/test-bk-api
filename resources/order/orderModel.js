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
      rentPerDay: { type: Number },
      noOfDays: { type: Number, default: 1 },
      quantity: { type: Number, default: 1 },
      amount: { type: Number },
    },
  ],
  // shipping_charge: { type: Number, default: 0 },
  // total_gross_amount: { type: Number, default: 0 },
  // tax_amount: { type: Number, default: 0 },
  totalAmount: { type: Number },
  paymentMode: { type: String, enum: ["cod", "debitCard", "creditCard"] },  
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

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
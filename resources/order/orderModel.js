import mongoose from "mongoose"
const orderSchema = new mongoose.Schema({
  order_id: { type: String },
  items: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      price: { type: Number },
      amount: { type: Number },
      quantity: { type: Number, default: 1 },
    },
  ],
  shipping_charge: { type: Number, default: 0 },
  total_gross_amount: { type: Number, default: 0 },
  tax_amount: { type: Number, default: 0 },
  total_amount: { type: Number, default: 0 },
  payment: {
    type: String,
    enum: ["success", "failed"],
  },
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
  status_timeline: {
    new: { type: Date },
    processing: { type: Date },
    dispatched: { type: Date },
    delivered: { type: Date },
    cancelled: { type: Date },
    returned: { type: Date },
  },
}, { timestamps: true });

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
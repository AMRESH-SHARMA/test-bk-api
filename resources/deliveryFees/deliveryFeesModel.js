import mongoose from "mongoose"
const deliveryFeesSchema = new mongoose.Schema({
  fees: {
    type: Number,
    trim: true,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    unique: true,
  },
}, { timestamps: true });

const DeliveryFeesModel = mongoose.model("DeliveryFees", deliveryFeesSchema);
export default DeliveryFeesModel;
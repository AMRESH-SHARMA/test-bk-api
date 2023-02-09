import mongoose from "mongoose"
const serviceFeesSchema = new mongoose.Schema({
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

const ServiceFeesModel = mongoose.model("ServiceFees", serviceFeesSchema);
export default ServiceFeesModel;
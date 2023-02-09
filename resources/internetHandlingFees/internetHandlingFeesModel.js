import mongoose from "mongoose"
const internetHandlingFeesSchema = new mongoose.Schema({
  fees: {
    type: Number,
    trim: true,
  },
}, { timestamps: true });

const internetHandlingFeesModel = mongoose.model("internetHandlingFees", internetHandlingFeesSchema);
export default internetHandlingFeesModel;
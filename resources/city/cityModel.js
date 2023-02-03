import mongoose from "mongoose"
const citySchema = new mongoose.Schema({
  city: {
    type: String,
    trim: true,
    required: true,
    maxLength: 20,
    unique: true,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
  },
}, { timestamps: true });

citySchema.pre('save', function (next) {
  try {
    const words = this.city.split(' ')
    this.city = words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
    next()
  } catch (e) {
    console.log(e);
  }
})

const cityModel = mongoose.model("City", citySchema);
export default cityModel;
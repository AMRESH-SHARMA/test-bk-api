import mongoose from "mongoose"
const stateSchema = new mongoose.Schema({
  state: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    maxLength: 20,
  },
}, { timestamps: true });

stateSchema.pre('save', function (next) {
  try {
    const words = this.state.split(' ')
    this.state = words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
    next()
  } catch (e) {
    console.log(e);
  }
})

const StateModel = mongoose.model("State", stateSchema);
export default StateModel;
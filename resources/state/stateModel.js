import mongoose from "mongoose"
const stateSchema = new mongoose.Schema({
  state: {
    type: String,
    unique: true,
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
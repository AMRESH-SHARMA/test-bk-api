import mongoose from "mongoose"
const languageSchema = new mongoose.Schema({
  language: {
    type: String,
    unique: true,
  },
}, { timestamps: true });

languageSchema.pre('save', function (next) {
  try {
    const words = this.language.split(' ')
    this.language = words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
    next()
  } catch (e) {
    console.log(e);
  }
})

const LanguageModel = mongoose.model("Language", languageSchema);
export default LanguageModel;
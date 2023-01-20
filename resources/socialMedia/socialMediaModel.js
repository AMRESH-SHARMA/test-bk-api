import mongoose from "mongoose"
const socialMediaSchema = new mongoose.Schema({
  facebook: {
    type: String,
  },
  twitter: {
    type: String,
  },
  instagram: {
    type: String,
  },
  linkedin: {
    type: String,
  },
}, { timestamps: true });

const socialMediaModel = mongoose.model("SocialMedia", socialMediaSchema);
export default socialMediaModel;
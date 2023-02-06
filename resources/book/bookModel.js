import mongoose from "mongoose"
const bookSchema = new mongoose.Schema({
  bookName: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    maxLength: 50,
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language",
  },
  author: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    maxLength: 200,
  },
  rentPerDay: {
    type: Number,
  },
  image1:
  {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  image2:
  {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  image3:
  {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  image4:
  {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  approved: {
    type: Boolean,
    default: "true",
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

const bookModel = mongoose.model("Book", bookSchema);
export default bookModel;
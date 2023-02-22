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
  availability: {
    type: Boolean,
    default: "true",
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // It shows where  books are avaliable to order
  city: {
    type: String,
    trim: true,
    // required: true,
    maxLength: 20,
    unique: true,
  },
  state: {
    type: String,
    trim: true,
    // required: true,
    maxLength: 20,
    unique: true,
  },
}, { timestamps: true });

bookSchema.pre('save', function (next) {
  try {
    if (city) {
      const words = this.city.split(' ')
      this.city = words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    }
    if (state) {
      const words = this.state.split(' ')
      this.state = words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    }
    next()
  } catch (e) {
    console.log(e);
  }
})

const bookModel = mongoose.model("Book", bookSchema);
export default bookModel;
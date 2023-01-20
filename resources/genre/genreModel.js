import mongoose from "mongoose"
const genreSchema = new mongoose.Schema({
  genre: {
    type: String,
    unique: true,
  },
  image:
  {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
}, { timestamps: true });

genreSchema.pre('save', function (next) {
  try {
    const words = this.genre.split(' ')
    this.genre = words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
    next()
  } catch (e) {
    console.log(e);
  }
})

const GenreModel = mongoose.model("Genre", genreSchema);
export default GenreModel;
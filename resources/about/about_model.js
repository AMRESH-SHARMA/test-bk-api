import mongoose from "mongoose";
const { Schema, model } = mongoose;
const AboutSchema = new Schema(
  {
    about: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const About = model("about", AboutSchema);

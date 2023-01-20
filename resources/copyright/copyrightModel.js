import mongoose from "mongoose";
const { Schema, model } = mongoose;
const CopyrightSchema = new Schema(
  {
    copyright: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Copyright = model("copyright", CopyrightSchema);

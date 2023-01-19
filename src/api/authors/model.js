import mongoose from "mongoose";

const { Schema, model } = mongoose;

const authorsSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    picture: { type: String, required: false },
    bio: { type: String, required: false },
    themes: [String],
  },
  {
    timestamps: true,
  }
);

export default model("Author", authorsSchema);

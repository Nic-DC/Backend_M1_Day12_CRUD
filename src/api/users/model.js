import mongoose from "mongoose";

const { Schema, model } = mongoose;

const usersSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    age: { type: Number, required: false, min: 18, max: 65 },
    professions: [String],
    address: {
      street: { type: String },
      number: { type: Number },
    },
  },
  {
    timestamps: true, // this option automatically handles createdAt and updatedAt fields
  }
);

export default model("User", usersSchema); // this model is now binded to the "users" collection, if the collection does not exist, mongoose will create it automagically

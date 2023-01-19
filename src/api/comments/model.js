import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema({
  picture: { type: String, required: false },
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  blogID: [{ type: Schema.Types.ObjectId, ref: "BlogPost" }],
});

export default model("Comment", commentSchema);

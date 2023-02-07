import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogPostsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: false },
    readTime: {
      value: { type: Number, required: false },
      unit: { type: String, required: false },
    },
    // authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    authors: { type: Schema.Types.ObjectId, ref: "Author" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    content: [String],
    // comments: [
    //   {
    //     picture: { type: String, required: false },
    //     content: { type: String, required: true },
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

export default model("BlogPost", blogPostsSchema);

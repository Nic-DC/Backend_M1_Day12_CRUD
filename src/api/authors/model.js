import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model } = mongoose;

const authorsSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    picture: { type: String, required: false },
    bio: { type: String, required: false },
    themes: [String],
    blogs: [{ type: Schema.Types.ObjectId, ref: "BlogPost" }],
  },
  {
    timestamps: true,
  }
);

authorsSchema.pre("save", async function (next) {
  const currentAuthor = this;
  console.log("this: ", this);

  if (currentAuthor.isModified("password")) {
    const plainPW = currentAuthor.password;

    const hash = await bcrypt.hash(plainPW, 11);
    currentAuthor.password = hash;
  }
  next();
});

authorsSchema.methods.toJSON = function () {
  const authorDocument = this;
  console.log("this in methods.toJSON: ", this);
  const author = authorDocument.toObject();

  delete author.password;
  delete author.createdAt;
  delete author.updatedAt;
  delete author.__v;
  return author;
};

export default model("Author", authorsSchema);

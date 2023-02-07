import express from "express";
import createHttpError from "http-errors";
import AuthorsModel from "./model.js";
import { basicAuthMiddleware } from "../../lib/auth/basicAuth.js";
import BlogPostsModel from "../blogPosts/model.js";
const authorsRouter = express.Router();

authorsRouter.post("/", async (req, res, next) => {
  try {
    const author = new AuthorsModel(req.body);
    const newAuthor = await author.save();
    res.status(201).send(newAuthor);
  } catch (error) {
    console.log("POST author - ERROR: ", error);
    next(error);
  }
});

// GET - my blogs
authorsRouter.get("/me/stories", basicAuthMiddleware, async (req, res, next) => {
  try {
    const blogPosts = await BlogPostsModel.find({ authors: req.user._id.toString() });
    res.send(blogPosts);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await AuthorsModel.find();
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
    const author = await AuthorsModel.findById(req.params.authorId);
    if (author) {
      res.send(author);
    } else {
      next(createHttpError(404, `Author with id ${req.params.authorId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
    const updatedAuthor = await AuthorsModel.findByIdAndUpdate(
      req.params.authorId, // WHO you want to modify
      req.body, // HOW you want to modify
      { new: true, runValidators: true } // OPTIONS. By default findByIdAndUpdate returns the record PRE-MODIFICATION. If you want to get back the updated object --> new:true
      // By default validation is off here --> runValidators: true
    );

    if (updatedAuthor) {
      res.send(updatedAuthor);
    } else {
      next(createHttpError(404, `Author with id ${req.params.authorId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.delete("/:authorId", async (req, res, next) => {
  try {
    const deletedAuthor = await AuthorsModel.findByIdAndDelete(req.params.authorId);
    if (deletedAuthor) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Author with id ${req.params.authorId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;

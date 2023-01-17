import express from "express";
import BlogPostsModel from "./model.js";

import createHttpError from "http-errors";

const { NotFound, BadRequest } = createHttpError;

const blogPostsRouter = express.Router();

blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const newBlogPost = new BlogPostsModel(req.body);
    const { _id } = await newBlogPost.save();

    if (_id) {
      res.status(201).send({ message: `The new blog post with id: ${_id} successfully created` });
    } else {
      next(BadRequest(`Something went wrong for the world...`));
    }
  } catch (error) {
    next(error);
  }
});
blogPostsRouter.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
blogPostsRouter.get("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
blogPostsRouter.put("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
blogPostsRouter.delete("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
export default blogPostsRouter;

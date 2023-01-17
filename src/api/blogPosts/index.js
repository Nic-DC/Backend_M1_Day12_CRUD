import express from "express";
import BlogPostsModel from "./model.js";

import createHttpError from "http-errors";

const { NotFound, BadRequest } = createHttpError;

const blogPostsRouter = express.Router();

// POST new blog post
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

// 2. GET all blog posts
blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await BlogPostsModel.find();
    if (blogPosts.length > 0) {
      res.send(blogPosts);
    } else {
      next(NotFound(`There are no blog posts in our archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 3. GET single blog post
blogPostsRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const searchedBlogPost = await BlogPostsModel.findById(id);

    if (searchedBlogPost) {
      res.send(searchedBlogPost);
    } else {
      next(NotFound(`The blog post with id: ${id} is not in our archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 4. PUT
blogPostsRouter.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBlogPost = await BlogPostsModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    // OR
    // using the MANGOOSE DOCUMENT <object that has available different methods like save()> as a result of findById, findOne..
    // const updatedBlogPost = await BlogPostsModel.findById(id)
    // updatedBlogPost.content = "testing the alternate solution of making a put request PUT "
    // await updatedBlogPost.save()

    if (updatedBlogPost) {
      res.send(updatedBlogPost);
      //   res.send({
      //     message: `The blog post with id: ${id} has been successfully updated as you can see below`,
      //     updatedBlogPost: updatedBlogPost,
      //   });
    } else {
      next(NotFound(`The blog post with id: ${id} is NOT in our archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 5. DELETE
blogPostsRouter.delete("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
export default blogPostsRouter;

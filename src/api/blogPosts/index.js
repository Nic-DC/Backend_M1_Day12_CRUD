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
    const { id } = req.params;
    const deletedBlogPost = await BlogPostsModel.findByIdAndDelete(id);

    if (deletedBlogPost) {
      res.send({ message: `The blog post with name: ${deletedBlogPost.title} and id: ${id} successfully deleted` });
    } else {
      next(NotFound(`The blog post with id: ${id} is NOT in our archive`));
    }
  } catch (error) {
    next(error);
  }
});

/* --------------------------- blog posts: EMBEDDED COMMENTS ------------------------- */
// 1. POST
blogPostsRouter.post("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedBlogPost = await BlogPostsModel.findByIdAndUpdate(
      id,
      { $push: { comments: req.body } },
      { new: true, runValidators: true }
    );

    if (updatedBlogPost) {
      res.status(201).send({
        message: `Blog post with id: ${id} successfully updated and you can see all its comments below:`,
        bloggPost: updatedBlogPost,
      });
    } else {
      next(NotFound(`Blog post with id: ${id} not in our archive`));
    }
  } catch (error) {
    next(error);
  }
});

// GET all comments
blogPostsRouter.get("/:id/comments", async (req, res, next) => {
  try {
    const { id } = req.params;
    const searchedBlogPost = await BlogPostsModel.findById(id);
    console.log("searchedBlogPost: ", searchedBlogPost);

    if (searchedBlogPost) {
      res.send(searchedBlogPost.comments);
    } else {
      next(NotFound(`Blog post with id: ${id} not in our archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 3. GET comment by id
blogPostsRouter.get("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { commentId } = req.params;

    const searchedBlogPost = await BlogPostsModel.findById(id);

    if (searchedBlogPost) {
      const searchedComment = searchedBlogPost.comments.find((comment) => comment._id.toString() === commentId);

      if (searchedComment) {
        res.send(searchedComment);
      } else {
        next(NotFound(`Comment with id: ${commentId} is not in our archive`));
      }
    } else {
      next(NotFound(`Blog post with id: ${id} not in our archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 4. PUT comment
blogPostsRouter.put("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { commentId } = req.params;

    const searchedBlogPost = await BlogPostsModel.findById(id);

    if (searchedBlogPost) {
      const index = searchedBlogPost.comments.findIndex((comment) => comment._id.toString() === commentId);

      if (index !== -1) {
        searchedBlogPost.comments[index] = { ...searchedBlogPost.comments[index].toObject(), ...req.body };

        await searchedBlogPost.save();

        res.send({
          message: `The comment with id: ${commentId} has been successfully updated and you can see it below`,
          updatedComment: searchedBlogPost.comments[index],
        });
      }
    } else {
      next(NotFound(`Blog post with id: ${id} not in our archive`));
    }
  } catch (error) {
    next(error);
  }
});

// 5. DELETE comment
blogPostsRouter.delete("/:id/comments/:commentId", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { commentId } = req.params;

    const toBeDeletedBlogPost = await BlogPostsModel.findByIdAndUpdate(
      id,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    if (toBeDeletedBlogPost) {
      res.send({
        message: `Comment with id: ${commentId} from blog post '${toBeDeletedBlogPost.title}' has been successfully deleted`,
      });
    } else {
      next(NotFound(`Blog post with id: ${id} not in our archive`));
    }
  } catch (error) {
    next(error);
  }
});

export default blogPostsRouter;

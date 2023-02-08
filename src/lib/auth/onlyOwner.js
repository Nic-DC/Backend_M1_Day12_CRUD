import createHttpError from "http-errors";
import BlogPostsModel from "../../api/blogPosts/model.js";

export const onlyOwner = async (req, res, next) => {
  const blog = await BlogPostsModel.findById(req.params._id);

  if (blog.authors._id.toString() !== req.user._id.toString()) {
    res.status(403).send(`You can not edit this post because you're not the owner`);
    return;
  } else {
    req.blog = blog;
    next();
  }
};

import express from "express";
import createHttpError from "http-errors";
import UsersModel from "./model.js";
import { basicAuthMiddleware } from "../../lib/auth/basicAuth.js";
import { adminOnlyMiddleware } from "../../lib/auth/adminOnly.js";

const { NotFound } = createHttpError;

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const user = new UsersModel(req.body); // here it happens validation (thanks to Mongoose) of req.body, if it is not ok Mongoose will throw an error
    const newUser = await user.save();
    res.status(201).send(newUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", basicAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    // const users = await UsersModel.find({}, { firstName: 1, lastName: 1 });
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

// GET - your own user profile
usersRouter.route("/me").get(basicAuthMiddleware, async (req, res, next) => {
  try {
    const myUserProfile = req.user;
    if (myUserProfile) {
      res.send(myUserProfile);
    } else {
      next(NotFound(`The user is MIA`));
    }
  } catch (error) {
    console.log(`/me - GET user ERROR: ${error}`);
    next(error);
  }
});

usersRouter.get("/:userId", basicAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.params.userId, // WHO you want to modify
      req.body, // HOW you want to modify
      { new: true, runValidators: true } // OPTIONS. By default findByIdAndUpdate returns the record PRE-MODIFICATION. If you want to get back the updated object --> new:true
      // By default validation is off here --> runValidators: true
    );

    // ******************************************************** ALTERNATIVE METHOD **************************************************
    /*     const user = await UsersModel.findById(req.params.userId) // When you do a findById, findOne, etc,... you get back not a PLAIN JS OBJECT but you obtain a MONGOOSE DOCUMENT which is an object with some superpowers
    user.firstName = "George"
    await user.save()
    res.send(user) */
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const deletedUser = await UsersModel.findByIdAndDelete(req.params.userId);
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
export default usersRouter;

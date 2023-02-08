import express from "express";
import createHttpError from "http-errors";
import UsersModel from "./model.js";
import { JWTAuthMiddleware } from "../../lib/auth/JWTAuth.js";
import { adminOnlyMiddleware } from "../../lib/auth/adminOnly.js";
import { createAccessToken } from "../../lib/tools/tools.js";

const { NotFound } = createHttpError;

const usersRouter = express.Router();

// REGISTER
usersRouter.post("/register", async (req, res, next) => {
  try {
    const body = req.body;
    body.isRegistered = true;

    const user = new UsersModel(body); // here it happens validation (thanks to Mongoose) of req.body, if it is not ok Mongoose will throw an error

    const newUser = await user.save();
    res.status(201).send(newUser);
  } catch (error) {
    next(error);
  }
});

// LOGIN
usersRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UsersModel.checkCredentialsUsername(username, password);

    if (user) {
      const payload = { _id: user._id, role: user.role };
      const accessToken = await createAccessToken(payload);

      res.status(201).send(accessToken);
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/", async (req, res, next) => {
  try {
    const user = new UsersModel(req.body); // here it happens validation (thanks to Mongoose) of req.body, if it is not ok Mongoose will throw an error
    const newUser = await user.save();
    res.status(201).send(newUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    // const users = await UsersModel.find({}, { firstName: 1, lastName: 1 });
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

// usersRouter.get("/", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
//   try {
//     // const users = await UsersModel.find({}, { firstName: 1, lastName: 1 });
//     const users = await UsersModel.find();
//     res.send(users);
//   } catch (error) {
//     next(error);
//   }
// });

// GET - your own user profile
usersRouter.route("/me").get(JWTAuthMiddleware, async (req, res, next) => {
  try {
    const { _id } = req.user;

    const myUserProfile = await UsersModel.findById(_id);
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

usersRouter.get("/:userId", JWTAuthMiddleware, async (req, res, next) => {
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

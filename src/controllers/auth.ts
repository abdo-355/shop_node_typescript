import { RequestHandler } from "express";
import { HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";

import User, { IUser } from "../models/user";

declare module "express-session" {
  export interface SessionData {
    isLoggedIn: boolean;
    user: HydratedDocument<IUser>;
  }
}

export const getLogin: RequestHandler = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

export const postLogin: RequestHandler = (req, res, next) => {
  User.findById("63619223428cc889bf55f584")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user!;
      req.session.save((err) => {
        if (err) {
          console.log(err);
        }
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

export const getSignup: RequestHandler = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

export const postSignup: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const userDoc = await User.findOne({ email: email });

    if (userDoc) {
      return res.redirect("/signup");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      cart: [],
    });

    await user.save();

    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};

export const postLogout: RequestHandler = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

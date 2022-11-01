import { RequestHandler } from "express";
import { HydratedDocument } from "mongoose";

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
  User.findById("635d74c551112c2d76512228")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user!;
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

export const postLogout: RequestHandler = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

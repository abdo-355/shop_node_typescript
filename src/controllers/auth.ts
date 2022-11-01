import { RequestHandler } from "express";

declare module "express-session" {
  export interface SessionData {
    isLoggedIn: boolean;
  }
}

export const getLogin: RequestHandler = (req, res, next) => {
  console.log(req.session);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

export const postLogin: RequestHandler = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
};

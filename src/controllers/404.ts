import { RequestHandler } from "express";

const get404: RequestHandler = (req, res, next) => {
  res
    .status(404)
    .render("404", {
      pageTitle: "An Error occurred",
      path: "",
      isAuthenticated: req.session.isLoggedIn,
    });
};

export default get404;

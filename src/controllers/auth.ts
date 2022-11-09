import { RequestHandler } from "express";
import { HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import dotenv from "dotenv";
import crypto from "crypto";
import { validationResult } from "express-validator";

import User, { IUser } from "../models/user";
import DataError from "../util/customError";

dotenv.config();

const transporter = nodemailer.createTransport(
  nodemailerSendgrid({ apiKey: process.env.SENDGRID_API_KEY! })
);

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
    errorMessage: req.flash("error"),
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

export const postLogin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email,
          password,
        },

        validationErrors: errors.array(),
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: "Invalid email or password",
        oldInput: {
          email,
          password,
        },
        validationErrors: [],
      });
    }

    const doMatch = await bcrypt.compare(password, user.password);

    if (doMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user!;
      return req.session.save((err) => {
        if (err) {
          console.log(err);
        }
        res.redirect("/");
      });
    }
    req.flash("error", "Invalid email or password");
    res.redirect("/login");
  } catch (err) {
    const error = new DataError(err, 500);
    return next(error);
  }
};

export const getSignup: RequestHandler = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: req.flash("error"),
    oldInput: {
      name: "",
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

export const postSignup: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          name: name,
          email: email,
          password: password,
        },
        validationErrors: errors.array(),
      });
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

    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL,
      subject: "Signup succeeded!",
      html: "<h1>You signedup successfully!</h1><p>thanks for choosing us</p>",
    });
  } catch (err) {
    const error = new DataError(err, 500);
    return next(error);
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

export const getReset: RequestHandler = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: req.flash("error"),
  });
};

export const postReset: RequestHandler = (req, res, next) => {
  crypto.randomBytes(32, async (err, buffer) => {
    try {
      if (err) {
        console.log(err);
        return res.redirect("/reset");
      }

      const token = buffer.toString("hex");

      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        req.flash("error", "this email doesn't exist");
        return res.redirect("reset");
      }

      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();

      res.redirect("/");

      transporter.sendMail({
        to: req.body.email,
        from: process.env.EMAIL,
        subject: "Password reset",
        html: `<p>you requested a password reset</p>
        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>`,
      });
    } catch (err) {
      const error = new DataError(err, 500);
      return next(error);
    }
  });
};

export const getNewPassword: RequestHandler = async (req, res, next) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "New Password",
      errorMessage: req.flash("error"),
      userId: user?._id.toString(),
      passwordToken: token,
    });
  } catch (err) {
    const error = new DataError(err, 500);
    return next(error);
  }
};

export const postNewPassword: RequestHandler = async (req, res, next) => {
  try {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const token = req.body.passwordToken;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user!.password = hashedPassword;
    user!.resetToken = undefined;
    user!.resetTokenExpiration = undefined;

    await user!.save();

    res.redirect("/login");
  } catch (err) {
    const error = new DataError(err, 500);
    return next(error);
  }
};

import { RequestHandler } from "express";
import { HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import dotenv from "dotenv";

import User, { IUser } from "../models/user";

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
  });
};

export const postLogin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/login");
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
    console.log(err);
  }
};

export const getSignup: RequestHandler = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: req.flash("error"),
  });
};

export const postSignup: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const userDoc = await User.findOne({ email: email });

    if (userDoc) {
      req.flash("error", "E-mail already exists, please pick a different one");
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

    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL,
      subject: "Signup succeeded!",
      html: "<h1>You signedup successfully!</h1><p>thanks for choosing us</p>",
    });
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

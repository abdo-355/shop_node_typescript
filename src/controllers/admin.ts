import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import path from "path";
import Product from "../models/product";
import DataError from "../util/customError";

export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const products = await Product.find({ userId: req.user._id });
    res.render(path.join("admin", "products"), {
      prods: products,
      pageTitle: "Admin products",
      path: "/admin/products",
    });
  } catch (err) {
    const error = new DataError(err, 500);
    return next(error);
  }
};

export const getAddProduct: RequestHandler = (req, res, next) => {
  res.render(path.join("admin", "edit-product"), {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    errorMessage: req.flash("error"),
    editMode: "false",
    oldInput: { title: "", imgUrl: "", description: "", price: "" },
    validationErrors: [],
  });
};

export const postAddProduct: RequestHandler = async (req, res, next) => {
  try {
    const { title, description, price } = req.body;
    const image = req.file;
    const errors = validationResult(req);

    if (!image) {
      return res.status(422).render(path.join("admin", "edit-product"), {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editMode: "false",
        errorMessage: "Attached file is not an image",
        oldInput: { title, description, price },
        validationErrors: [],
      });
    }

    const imgUrl = image.path;

    if (!errors.isEmpty()) {
      return res.status(422).render(path.join("admin", "edit-product"), {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editMode: "false",
        errorMessage: errors.array()[0].msg,
        oldInput: { title, description, price },
        validationErrors: errors.array(),
      });
    }

    const product = new Product({
      title: title,
      description: description,
      imgUrl: imgUrl,
      price: +price,
      userId: req.user,
    });

    await product.save();

    res.redirect("/");
  } catch (err) {
    const error = new DataError(err, 500);
    return next(error);
  }
};

export const getEditProduct: RequestHandler = async (req, res, next) => {
  try {
    const editMode = req.query.edit;

    if (editMode !== "true") {
      res.redirect("/");
    }

    const productId = req.params.productId;

    const product = await Product.findById(productId);

    res.render(path.join("admin", "edit-product"), {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editMode,
      errorMessage: req.flash("error"),
      product: product,
      oldInput: { title: "", imgUrl: "", description: "", price: "" },
      validationErrors: [],
    });
  } catch (err) {
    const error = new DataError(err, 500);
    return next(error);
  }
};

export const postEditProduct: RequestHandler = async (req, res, next) => {
  try {
    const productId = req.body.id;
    const updatedTitle = req.body.title;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    const image = req.file;
    const errors = validationResult(req);

    const product = await Product.findById(productId);

    if (req.user._id.toString() !== product?.userId.toString()) {
      return res.redirect("/");
    }

    if (!errors.isEmpty()) {
      return res.status(422).render(path.join("admin", "edit-product"), {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editMode: "true",
        errorMessage: errors.array()[0].msg,
        product: {
          _id: productId,
          title: updatedTitle,
          description: updatedDescription,
          price: updatedPrice,
        },
        validationErrors: errors.array(),
      });
    }

    product!.title = updatedTitle;
    product!.description = updatedDescription;
    if (image) {
      product!.imgUrl = image.path;
    }
    product!.price = updatedPrice;

    await product!.save();

    res.redirect("/admin/products");
  } catch (err) {
    const error = new DataError(err, 500);
    return next(error);
  }
};

export const postDeleteProduct: RequestHandler = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    await Product.findOneAndDelete({ _id: productId, userId: req.user._id });

    console.log("deleted");
    res.redirect("/admin/products");
  } catch (err) {
    const error = new DataError(err, 500);
    return next(error);
  }
};

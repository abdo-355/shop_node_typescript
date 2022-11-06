import { RequestHandler } from "express";

import path from "path";
import Product from "../models/product";

export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const products = await Product.find({ userId: req.user._id });
    res.render(path.join("admin", "products"), {
      prods: products,
      pageTitle: "Admin products",
      path: "/admin/products",
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAddProduct: RequestHandler = (req, res, next) => {
  res.render(path.join("admin", "edit-product"), {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editMode: "false",
  });
};

export const postAddProduct: RequestHandler = async (req, res, next) => {
  try {
    const { title, imgUrl, description, price } = req.body;

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
    console.log(err);
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
      product: product,
    });
  } catch (err) {
    console.log(err);
  }
};

export const postEditProduct: RequestHandler = async (req, res, next) => {
  try {
    const productId = req.body.id;
    const updatedTitle = req.body.title;
    const updatedDescription = req.body.description;
    const updatedImg = req.body.imgUrl;
    const updatedPrice = req.body.price;

    const product = await Product.findById(productId);

    if (req.user._id.toString() !== product?.userId.toString()) {
      return res.redirect("/");
    }

    product!.title = updatedTitle;
    product!.description = updatedDescription;
    product!.imgUrl = updatedImg;
    product!.price = updatedPrice;

    await product!.save();

    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

export const postDeleteProduct: RequestHandler = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    await Product.findOneAndDelete({ _id: productId, userId: req.user._id });

    console.log("deleted");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

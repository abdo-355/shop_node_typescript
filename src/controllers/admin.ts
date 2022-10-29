import { RequestHandler } from "express";

import path from "path";
import Product from "../models/product";

export const getProducts: RequestHandler = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render(path.join("admin", "products"), {
        prods: products,
        pageTitle: "Admin products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

export const getAddProduct: RequestHandler = (req, res, next) => {
  res.render(path.join("admin", "edit-product"), {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editMode: "false",
  });
};

export const postAddProduct: RequestHandler = (req, res, next) => {
  const { title, imgUrl, description, price } = req.body;

  console.log(req.user);

  const product = new Product({
    title: title,
    description: description,
    imgUrl: imgUrl,
    price: +price,
    userId: req.user,
  });

  product.save().then(() => res.redirect("/"));
  // .catch((err) => console.log(err));
};

export const getEditProduct: RequestHandler = (req, res, next) => {
  const editMode = req.query.edit;
  if (editMode !== "true") {
    res.redirect("/");
  }
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.render(path.join("admin", "edit-product"), {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

export const postEditProduct: RequestHandler = (req, res, next) => {
  const productId = req.body.id;
  const updatedTitle = req.body.title;
  const updatedDescription = req.body.description;
  const updatedImg = req.body.imgUrl;
  const updatedPrice = req.body.price;

  Product.findById(productId)
    .then((product) => {
      product!.title = updatedTitle;
      product!.description = updatedDescription;
      product!.imgUrl = updatedImg;
      product!.price = updatedPrice;

      return product!.save();
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

export const postDeleteProduct: RequestHandler = (req, res, next) => {
  const productId = req.body.productId;

  Product.findByIdAndRemove(productId)
    .then(() => {
      console.log("deleted");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

import { RequestHandler } from "express";

import path from "path";
import Product from "../models/product";

export const getProducts: RequestHandler = (req, res, next) => {
  Product.fetchAll()
    .then(([products, fieldData]) => {
      res.render(path.join("admin", "products"), {
        prods: products,
        pageTitle: "Admin products  ",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
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

  const product = new Product(null, title, imgUrl, description, price);
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
};

export const getEditProduct: RequestHandler = (req, res, next) => {
  const editMode = req.query.edit;
  if (editMode !== "true") {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  Product.findProductById(productId).then(([product]) => {
    if (!product[0]) {
      return res.redirect("/");
    }
    res.render(path.join("admin", "edit-product"), {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editMode,
      product: product[0],
    });
  });
};

export const postEditProduct: RequestHandler = (req, res, next) => {
  const productId = req.body.id;
  const updatedTitle = req.body.title;
  const updatedDescription = req.body.description;
  const updatedImg = req.body.imgUrl;
  const updatedPrice = req.body.price;

  const updatedProduct = new Product(
    productId,
    updatedTitle,
    updatedImg,
    updatedDescription,
    updatedPrice
  );

  updatedProduct.save();
  res.redirect("/admin/products");
};

export const postDeleteProduct: RequestHandler = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteProduct(productId);
  res.redirect("/admin/products");
};

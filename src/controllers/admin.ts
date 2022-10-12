import { RequestHandler } from "express";

import path from "path";
import Product from "../models/product";

export const getProducts: RequestHandler = (req, res, next) => {
  Product.fetchAll((products: Product[]) => {
    res.render(path.join("admin", "products"), {
      prods: products,
      pageTitle: "Admin products  ",
      path: "/admin/products",
    });
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

  const product = new Product(title, imgUrl, description, price);
  product.save();
  res.redirect("/");
};

export const getEditProduct: RequestHandler = (req, res, next) => {
  const editMode = req.query.edit;
  if (editMode !== "true") {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  Product.findProductById(productId, (product: Product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render(path.join("admin", "edit-product"), {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editMode,
      product,
    });
  });
};

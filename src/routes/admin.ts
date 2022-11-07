import express from "express";
import { body } from "express-validator";

import * as adminController from "../controllers/admin";
import isAuth from "../middleware/is-auth";

const router = express.Router();

router.get("/products", isAuth, adminController.getProducts);

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post(
  "/add-product",
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .trim()
      .withMessage("Please enter a valid title"),
    body("imgUrl").isURL().withMessage("Please enter a valid image URL"),
    body("price").isFloat().withMessage("Please enter a valid price"),
    body("description")
      .isLength({ min: 5, max: 400 })
      .trim()
      .withMessage("The description must be from 5 to 400 characters"),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-Product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .trim()
      .withMessage("Please enter a valid title"),
    body("imgUrl").isURL().withMessage("Please enter a valid image URL"),
    body("price").isFloat().withMessage("Please enter a valid price"),
    body("description")
      .isLength({ min: 5, max: 400 })
      .trim()
      .withMessage("The description must be from 5 to 400 characters"),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

export default router;

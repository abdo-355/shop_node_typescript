import express from "express";

import * as adminController from "../controllers/admin";

const router = express.Router();

router.get("/products", adminController.getProducts);

router.get("/add-product", adminController.getAddProduct);

router.post("/add-product", adminController.postAddProduct);

router.get("/edit-Product/:productId", adminController.getEditProduct);

export default router;

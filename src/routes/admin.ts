import express, { RequestHandler } from "express";

import * as productsController from "../controllers/products";

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", productsController.getAddProduct);

// /admin/add-product => POST
router.post("/add-product", productsController.postAddProduct);

export default router;

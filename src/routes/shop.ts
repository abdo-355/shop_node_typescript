import * as shopController from "../controllers/shop";

import express from "express";

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

// router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

// router.post("/cart-delete-item", shopController.postDeleteItem);

// router.post("/create-order", shopController.postOrder);

// router.get("/orders", shopController.getOrders);

export default router;

import path from "path";
import { getProducts } from "../controllers/products";

import express, { RequestHandler } from "express";

import rootDir from "../util/path";

const router = express.Router();

router.get("/", getProducts);

export default router;

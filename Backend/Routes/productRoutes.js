const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../Controllers/productController");

const { protect, admin } = require("../Middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);

router.route("/:id").get(getProductById).put(protect,admin,updateProduct).delete(protect,admin,deleteProduct);

module.exports = router;

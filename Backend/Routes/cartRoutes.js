const express=require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../Controllers/cartController");

const {protect} = require("../Middleware/authMiddleware.js");

const router = express.Router();

router.use(protect);

router.route("/").get(getCart).post(addToCart).delete(clearCart);
router.route("/:productId").put(updateCartItem).delete(removeFromCart);

module.exports = router;
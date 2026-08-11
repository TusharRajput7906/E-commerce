const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../Controllers/orderController");
const { protect, admin } = require("../Middleware/authMiddleware");

const router = express.Router();

router.use(protect); // saari order routes protected hain

router.route("/").post(createOrder).get(admin, getAllOrders);
router.get("/myorders", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", admin, updateOrderStatus);

module.exports = router;
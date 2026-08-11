const Order = require("../Models/Order");
const Cart = require("../Models/Cart");
const Product = require("../Models/Product");
const asyncHandler = require("../Middleware/asyncHandler");

// @desc    Create new order (checkout from cart)
// @route   POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  // Stock check karo har item ke liye pehle
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Not enough stock for ${item.product.name}`);
    }
  }

  // Order items banao (snapshot with name & price)
  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
  }));

  const itemsPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 50; // 500 se upar free shipping
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  // Stock kam karo har product ka
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity }, // stock se quantity minus karo
    });
  }

  // Cart khaali karo checkout ke baad
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(orders);
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Check karo ye order isi user ka hai, ya admin hai
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.status(200).json(order);
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
  res.status(200).json(orders);
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.orderStatus = orderStatus;
  if (orderStatus === "Delivered") {
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();
  res.status(200).json(updatedOrder);
});

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
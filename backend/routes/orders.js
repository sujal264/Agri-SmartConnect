const express = require("express");
const router  = express.Router();
const Order   = require("../models/Order");
const Product = require("../models/Product");
const protect = require("../middleware/auth");

// GET /api/orders/buyer — buyer's orders
router.get("/buyer", protect, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate("farmer",  "name farmName location phone")
      .populate("product", "name title unit price category")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/farmer — farmer's received orders
router.get("/farmer", protect, async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user.id })
      .populate("buyer",   "name email phone companyName")
      .populate("product", "name title unit price")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/orders — place new order
router.post("/", protect, async (req, res) => {
  try {
    const { productId, quantity, deliveryAddress, note } = req.body;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });
    if (product.status !== "available")
      return res.status(400).json({ success: false, message: "Product not available" });

    const totalPrice = product.price * quantity;

    const order = await Order.create({
      buyer:           req.user.id,
      farmer:          product.farmer,
      product:         productId,
      quantity,
      totalPrice,
      deliveryAddress: deliveryAddress || "",
      note:            note || "",
    });

    const populated = await Order.findById(order._id)
      .populate("farmer",  "name farmName")
      .populate("product", "title unit price");

    res.status(201).json({ success: true, order: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/orders/:id/status — farmer updates status
router.put("/:id/status", protect, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user.id },
      { status: req.body.status },
      { new: true }
    );
    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/orders/:id/cancel — buyer cancels order
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, buyer: req.user.id, status: "pending" },
      { status: "cancelled" },
      { new: true }
    );
    if (!order)
      return res.status(404).json({ success: false, message: "Cannot cancel this order" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
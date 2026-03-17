const express = require("express");
const router  = express.Router();
const Product = require("../models/Product");
const protect = require("../middleware/auth");

// ── Farmer only middleware ────────────────────────────────────
const farmerOnly = (req, res, next) => {
  if (req.user.role !== "farmer")
    return res.status(403).json({ success: false, message: "Farmers only" });
  next();
};

// ─────────────────────────────────────────────────────────────
// GET /api/products — all available products (for buyers too)
// ─────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = { status: "available" };
    if (category) query.category = category;
    if (search)   query.title = { $regex: search, $options: "i" };

    const products = await Product.find(query)
      .populate("farmer", "name farmName location phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/products/my — farmer's own listings
// ─────────────────────────────────────────────────────────────
router.get("/my", protect, farmerOnly, async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/products — create new listing
// ─────────────────────────────────────────────────────────────
router.post("/", protect, farmerOnly, async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      farmer: req.user.id,
    });
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// PUT /api/products/:id — update listing
// ─────────────────────────────────────────────────────────────
router.put("/:id", protect, farmerOnly, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/products/:id — delete listing
// ─────────────────────────────────────────────────────────────
router.delete("/:id", protect, farmerOnly, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user.id,
    });
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Listing deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
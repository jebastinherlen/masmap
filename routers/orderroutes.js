const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authmiddleware");
const {createOrder, getMyOrders, getAllOrders, updateOrderStatus, paymentstatus} = require("../controllers/ordercontroller");

// ✅ User Routes
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);

// ✅ Admin Routes
router.get("/all", protect, adminOnly, getAllOrders);
router.patch("/:id/orderstatus", protect, adminOnly, updateOrderStatus);
router.patch("/:id/paymentstatus", protect, adminOnly, paymentstatus);


module.exports = router;

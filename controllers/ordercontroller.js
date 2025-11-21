const Order = require("../models/ordermodel");

// 🟢 Create a new order
const createOrder = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Not authorized. User not found." });
    }

    const userId = req.user._id;
    let { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    // Remove image field from order items
    orderItems = orderItems.map(({ image, ...item }) => item);

    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress: shippingAddress ?? {
        address: "To be provided",
        city: "To be provided",
        postalCode: "To be provided",
        country: "To be provided",
      },
      paymentMethod: paymentMethod || "COD",
      totalPrice,

      // ⭐ ADD THESE FIELDS ⭐
      isPaid: false,
      status: "Pending",
    });

    const createdOrder = await order.save();
    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

// 🟢 Get logged-in user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.earphone")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// 🟢 Get all orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all orders", error: error.message });
  }
};

// 🟢 Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // ❗ FIX: use correct field
    order.status = status;

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status" });
  }
};

// 🟢 Update payment status (Admin/User)
const paymentstatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { isPaid, paymentMethod } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = isPaid;
    order.paidAt = isPaid ? new Date() : null;

    if (paymentMethod) order.paymentMethod = paymentMethod;

    await order.save();

    res.json({
      message: "Payment status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating payment status",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  paymentstatus,
};

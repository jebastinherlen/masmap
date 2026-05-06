const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
  forgotPassword,
  resetPassword
} = require("../controllers/usercontroller");

const { protect, adminOnly } = require("../middlewares/authmiddleware");

const router = express.Router();

// 🔐 Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔑 Forgot password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// 👑 Admin
router.get("/all", protect, adminOnly, getAllUsers);
router.patch("/update", protect, adminOnly, updateUserRole);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
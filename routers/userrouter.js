const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/usercontroller");
const { protect, adminOnly } = require("../middlewares/authmiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all", protect, adminOnly, getAllUsers);
router.patch("/update", protect, adminOnly, updateUserRole);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;

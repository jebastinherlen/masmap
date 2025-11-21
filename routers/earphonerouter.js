const express = require("express");
const upload = require("../config/multer.js");
const {protect, adminOnly} = require("../middlewares/authmiddleware.js")

const {
  createEarphone,
  getone,
  getAllEarphones,
  patchEarphone,
  deleteEarphone,
  putmethod,
} = require("../controllers/earphonecontroller.js");


const router = express.Router();

router.post("/add-earphone", protect, upload.array("image", 10), createEarphone);
router.get("/" ,getAllEarphones);
router.get("/:id", getone);
router.patch("/:id", protect, adminOnly, upload.array("image", 10), patchEarphone);
router.put("/:id",protect,adminOnly, upload.array("image", 10), putmethod);
router.delete("/:id", protect, adminOnly, deleteEarphone);

module.exports = router;

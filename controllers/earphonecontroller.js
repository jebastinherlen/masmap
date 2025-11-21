const Earphone = require("../models/earphone.js");
const cloudinary = require('../config/cloudinary.js');
const fs = require("fs");

createEarphone = async (req, res) => {
  try {
    const { brand, model, type, price, color, rating, in_stock } = req.body;
    let imageUrls = [];

    // Upload images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: "Earphone",
        });
        imageUrls.push(upload.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    const newEarphone = new Earphone({
      brand,
      model,
      type,
      price,
      color,
      rating,
      in_stock,
      image: imageUrls,
    });

    const saved = await newEarphone.save();
    res.status(201).json(saved);

  } catch (error) {
    console.error("error", error);
    res.status(400).json({ message: error.message });
  }
};


const getone = async (req, res) => {
  try {
    const { id } = req.params;
    const earphone = await Earphone.findById(id);

    if (!earphone) return res.status(404).json({ message: "Earphone not found" });

    res.json(earphone);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllEarphones = async (req, res) => {
  try {
    const all = await Earphone.find();
    res.status(200).json(all);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const patchEarphone = async (req, res) => {
  try {
    const { id } = req.params;
    const { brand, model, type, price, color, rating, in_stock } = req.body;

    const earphone = await Earphone.findById(id);
    if (!earphone) return res.status(404).json({ message: "Earphone not found" });

    let imageUrls = earphone.image;

    // If new files uploaded, delete old + upload new
    if (req.files && req.files.length > 0) {

      // Delete old Cloudinary images
      if (earphone.image && earphone.image.length > 0) {
        for (const url of earphone.image) {
          const parts = url.split("/");
          const fileName = parts[parts.length - 1]; 
          const publicId = `Earphone/${fileName.split(".")[0]}`;
          await cloudinary.uploader.destroy(publicId);
        }
      }

      // Upload new images
      imageUrls = [];
      for (const file of req.files) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: "Earphone",
        });
        imageUrls.push(upload.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    const updated = await Earphone.findByIdAndUpdate(
      id,
      {
        brand,
        model,
        type,
        price,
        color,
        rating,
        in_stock,
        image: imageUrls,
      },
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const putmethod = async (req, res) => {
  try {
    const { id } = req.params;

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "books",
        });

        imageUrls.push(uploadResult.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    const updatedearphone = await Earphone.findByIdAndUpdate(
      id,
      {
        brand: req.body.brand,
        model: req.body.model,
        type: req.body.type,
        price: req.body.price,
        color: req.body.color,
        image: imageUrls.length > 0 ? imageUrls : undefined, 
      },
      { new: true }
    );

    res.json(updatedearphone);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

deleteEarphone = async (req, res) => {
  try {
    const { id } = req.params;

    const earphone = await Earphone.findById(id);
    if (!earphone) return res.status(404).json({ message: "Earphone not found" });

    // Delete images from cloudinary
    if (earphone.image && earphone.image.length > 0) {
      for (const url of earphone.image) {
        const parts = url.split("/");
        const fileName = parts[parts.length - 1];
        const publicId = `Earphone/${fileName.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Earphone.findByIdAndDelete(id);

    res.status(200).json({ message: "Earphone deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createEarphone,getone,getAllEarphones,patchEarphone,putmethod,deleteEarphone };

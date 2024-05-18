const express = require("express");
const router = express.Router();
const Property = require("../db/propertyModel");
const verifyToken = require("../helpers/verifyToken");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/properties");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

//tạo mới property
router.post("/create", upload.single('images'), verifyToken, async (req, res) => {
  try {
    const newPropertyObj = {
      ...req.body,
      user_id: req.user[0]._id,
      images: req.file.filename
    };
    const property = await Property.findOne({
      serialNumber: newPropertyObj.serialNumber,
    });
    if (property) {
      return res.status(401).json({ message: "Property already exist!" });
    }
    const newProperty = await Property.create(newPropertyObj);
    if (!newProperty) {
      return res.status(402).json({ messeage: "Fail!" });
    }
    res.status(200).json(newProperty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get property by id
router.get("/detail/:id", async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findOne({ _id: propertyId });
    if (!property) {
      return res.status(404).json({ message: "Property not found!" });
    }
    res.status(200).json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get list property of user
router.get("/list", verifyToken, async (req, res) => {
  try {
    const user_id = req.user[0]._id;
    const listProperty = await Property.find({ user_id: user_id });
    if (!listProperty || listProperty.length === 0) {
      return res.status(404).json({ message: "User have no property!" });
    }
    res.status(200).json(listProperty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


//update property
router.patch("/:id", upload.single('images'), async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);
    if(!property){
      return res.status(404).json({message: "Property not found!"});
    }
    const updates = {
      ...req.body,
      images: req.file.filename
    };
    for (const field in updates) {
      if (property.schema.paths[field]) { 
        property[field] = updates[field];
      }
    }
    await property.save();
    return res.status(200).json({message: "Update Success!", updatedProperty: property})
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

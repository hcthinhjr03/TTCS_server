const express = require("express");
const Users = require("../db/userModel");
const router = express.Router();
const fs = require("fs");
const verifyToken = require("../helpers/verifyToken");
const privateKey = fs.readFileSync("private.key");
const jwt = require("jsonwebtoken");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/users");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });


//dang ky
router.post("/register", async (req, res) => {
  const { email, password, full_name, gender } = req.body;
  try {
    const user = await Users.find({ email });
    if (user.length > 0) {
      return res.status(401).json({ message: "User already exist!" });
    }
    const newUser = await Users.create({ email, password, full_name, gender });
    if (!newUser) {
      return res.status(402).json({ messeage: "Fail!" });
    }
    res.status(200).json({ message: "Register Succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//dang nhap
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.find({ email, password });
    if (user.length == 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ user }, privateKey, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//dang xuat
router.post("/logout", verifyToken, async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

//Lay user voi userId
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findOne({ _id: id });

    if (!user) {
      return res.status(404).send("User not found");
    }
    delete user.__v;
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Update user
router.patch("/:id", upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.findById(userId);
    if(!user){
      return res.status(404).json({message: "User not found!"});
    }
    const updates = {
      ...req.body,
      avatar: req.file.filename
    };
    for (const field in updates) {
      if (user.schema.paths[field]) { 
        user[field] = updates[field];
      }
    }
    await user.save();
    return res.status(200).json({message: "Update Success!", updatedUser: user});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

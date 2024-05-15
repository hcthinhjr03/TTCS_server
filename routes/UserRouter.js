const express = require("express");
const Users = require("../db/userModel");
const router = express.Router();
const fs = require('fs');
const verifyToken = require("../helpers/verifyToken");
const privateKey = fs.readFileSync('private.key');
const jwt = require('jsonwebtoken');

//dang ky 
router.post("/register", async (req, res) => {
  const {username, password, first_name, last_name, location} = req.body;
  try {
    const user = await Users.find({username});
    if(user.length > 0) {
      return res.status(401).json({message: "User already exist!"});
    }
    const newUser = await Users.create({username, password, first_name, last_name, location});
    if(!newUser){
      return res.status(401).json({messeage: "Fail!"});
    }
    res.status(200).json({message: "Register Succesfully"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//dang nhap
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Users.find({ username, password });
    if (user.length == 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ user }, privateKey, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//dang xuat
router.post("/logout", verifyToken, async (req, res) => {
  res.json({ message: 'Logged out successfully'});
});

//Lay danh sach user
// router.get("/list", async (req, res) => {
//   try {
//     const users = await Users.find({});
//     const newUsers = users.map((user) => {
//       const { first_name, last_name, _id } = user;
//       return { first_name, last_name, _id };
//     });
//     res.json(newUsers);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

//Lay user voi userId
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findOne({ _id: id });

    if (!user) {
      return res.status(404).send("User not found");
    }
    delete user.__v;
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Lay user voi user name
// router.post("/username", async (req, res) => {
//   try {
//     const { username } = req.body;
//     const user = await Users.find({username: username});

//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     delete user.__v;
//     res.json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

module.exports = router;

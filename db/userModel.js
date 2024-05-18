const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {type: String},  
  password: {type: String},  
  full_name: { type: String },
  gender: { type: String },
  location: { type: String, default: "" },
  avatar: { type: String, default: "" },
});

module.exports = mongoose.model.Users || mongoose.model("Users", userSchema);

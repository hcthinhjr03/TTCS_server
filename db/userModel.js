const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {type: String},  
  password: {type: String},  
  first_name: { type: String },
  last_name: { type: String },
  location: { type: String },
});

module.exports = mongoose.model.Users || mongoose.model("Users", userSchema);

const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  propertyType: {
    type: String,
    required: true,
    enum: ["realEstate", "vehicle", "stock", "other"], // Có thể thêm các loại tài sản khác
  },
  propertyStatus: {
    type: String,
    required: true,
    enum: ["active", "inactive", "new", "old", "inUse", "inStorage"], // Có thể thêm các trạng thái khác
  },
  propertyName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  value: {
    type: Number,
    required: true,
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    trim: true,
  },
  images: {
    type: String,
    trim: true
  },
  supplier: {
    type: String,
    trim: true,
  },
  warranty: {
    type: Date,
  },
  serialNumber: {
    type: String,
    unique: true,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model.Property || mongoose.model("Property", propertySchema);

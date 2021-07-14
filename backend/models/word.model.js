const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("Word", wordSchema);

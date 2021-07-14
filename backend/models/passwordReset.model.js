const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("PasswordReset", passwordResetSchema, "reset");

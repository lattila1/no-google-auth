const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailValidated: {
    type: Boolean,
    required: true,
    default: false,
  },
  emailConfirmationCode: {
    type: String,
    required: true,
  },
  emailConfirmationCreatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema, "authEntity");

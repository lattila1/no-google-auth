const asyncHandler = require("express-async-handler");
const Word = require("../models/word.model");

exports.getPublic = asyncHandler(async (req, res) => {
  const word = await Word.findOne({ isPublic: true });

  res.json({ message: word.text });
});

exports.getPrivate = asyncHandler(async (req, res) => {
  console.log(`${req.user.userid} accessed the private endpoint`);
  const word = await Word.findOne({ isPublic: false });
  res.json({ message: word.text });
});

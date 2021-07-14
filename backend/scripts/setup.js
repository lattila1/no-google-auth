require("dotenv").config();
require("../database/connect")();
const Word = require("../models/word.model");

const initialWords = [
  {
    text: "public",
    isPublic: true,
  },
  {
    text: "private",
    isPublic: false,
  },
];

const main = async () => {
  console.log("INFO: dropping the words collection...");
  const count = await Word.countDocuments();
  if (count) {
    const result = await Word.collection.drop();
    console.log("INFO: words collection dropped");
  } else {
    console.log("INFO: words collection is empty, doing nothing");
  }

  for (const initialWord of initialWords) {
    const word = new Word(initialWord);
    await word.save();
    console.log("INFO: new word added with text:", word.text);
  }

  process.exit(0);
};

main();

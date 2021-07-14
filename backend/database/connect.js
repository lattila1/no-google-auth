const mongoose = require("mongoose");

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("ERR: Database connection error, trying to reconnect...", err);
});

db.once("open", () => {
  console.log("INFO: Connected to the database");
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .catch((err) => {
    console.error("ERR: Initial database connection error, exiting...", err);
    process.exit(1);
  });

require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());
app.use("/api", require("./routes/api.route"));
app.use(require("./middlewares/errorHandler"));

module.exports = app;

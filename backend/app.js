require("dotenv").config();
require("./database/connect");

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const hostname = "localhost";

app.use(express.json());
app.use("/api", require("./routes/api.route"));
app.use(require("./middlewares/errorHandler"));

app.listen(port, hostname, () => {
  console.log(`INFO: Started Express app at http://${hostname}:${port}/`);
});

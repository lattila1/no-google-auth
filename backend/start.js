require("dotenv").config();
require("./database/connect");
const app = require("./app");
const port = process.env.PORT || 8000;
const hostname = "localhost";

app.listen(port, hostname, () => {
  console.log(`INFO: Started Express app at http://${hostname}:${port}/`);
});

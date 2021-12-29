const express = require("express");

const userRout = require("../routers/user");

require("dotenv").config();

require("../db/mongoose");
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRout);

app.listen(port, () => {
  console.log(`Your browser is running on localhost: ${port}`);
});

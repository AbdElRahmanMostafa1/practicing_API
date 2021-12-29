const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log(`DB`))
  .catch(() => console.log(`DB ERROR`));

module.exports = mongoose;

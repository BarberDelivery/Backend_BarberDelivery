if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const { mongoConnect } = require("./configMongodb/mongoConnection");
const app = express();
const port = process.env.PORT || 3000;
const router = require("./routes");

app.use(express.json());

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use("/", router);
app.use(errorHandler);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

(async () => {
  try {
    await mongoConnect();
    app.listen(port, (_) => console.log(`App is listening at port ${port}`));
  } catch (err) {
    console.log(`Failed to connect to mongodb`);
  }
})();

// module.exports = app; For the testing purpose

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const port = process.env.PORT || 3000;
const router = require("./routes");

app.use(express.json());

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use("/", router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// module.exports = app; For the testing purpose

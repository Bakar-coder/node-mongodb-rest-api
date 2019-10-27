require("express-async-errors");
require("joi-objectid");
const express = require("express"),
  config = require("config"),
  mongoose = require("mongoose"),
  cors = require("cors"),
    compression = require('compression'),
  db = require("./utils/db").mongoURI,
  fs = require("fs"),
  fileupload = require("express-fileupload"),
    helmet = require('helmet'),
  morgan = require("morgan"),
  path = require("path"),
  port = process.env.PORT || 5000,
  app = express();

// set environment variables
if (!config.get("jwtPrivateKey")) {
  console.log("No Private Key Provided...");
  process.exit(1);
}

// import all app routes
const users = require("./routes/users"),
  addProduct = require("./routes/admin/addProduct"),
  products = require("./routes/products");

// create log file
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// initialize app middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "client")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(fileupload());
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(cors());
app.use("/api/users", users);
app.use("/api/admin", addProduct);
app.use("/api/products", products);

// connect app to mongodb database
mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("Connected to mongodb database..."))
  .catch(err => console.error("Database Connection Error! --", err));

// start node app
app.listen(port, () => console.log(`serving app on port: ${port}...`));

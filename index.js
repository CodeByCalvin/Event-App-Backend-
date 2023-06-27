require("dotenv").config();
const express = require("express"); // for building the REST APIs
const bodyParser = require("body-parser"); // for parsing incoming request bodies
const cors = require("cors"); // for security
const helmet = require("helmet"); // for security
const morgan = require("morgan"); // for logging
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const port = process.env.PORT || 3001;
const dburi = process.env.DBURI;
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid"); // for generating unique IDs
const router = require("./router.js");

const { User } = require("./models/user");

mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true });

// defining the Express app
const app = express();

// enabling CORS for all requests
app.use(cors());

// Header
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// Registering the routes
app.use("/", router);

// adding Helmet to enhance your API's security
app.use(helmet());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

// Starting the server
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// Connect to MongoDB
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
  console.log("Database connected!");
});

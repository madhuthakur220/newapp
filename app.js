var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser"); // or you can use built-in middleware
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Database connection start here
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
mongoose
  .connect("mongodb://localhost:27017/MadhuThakur")
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Database connection error:", err));

const connect = mongoose.connection;
connect.once("open", function () {
  console.log("Database connected successfully");
});

connect.on("error", function (err) {
  console.log("Database connection error: " + err);
});
// end here

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded bodies
// app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/viewrecord", indexRouter);
app.use("/editrecord", indexRouter);
app.use("/login", indexRouter);
app.use("/demo", indexRouter);
// app.use("/editbutton", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
// Middleware setup
app.use(
  session({
    secret: "1996",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);
module.exports = app;

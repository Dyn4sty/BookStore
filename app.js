const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrfProtection = require("csurf")();
const User = require("./models/user");
const errorController = require("./controllers/error");
const flash = require("connect-flash");
const app = express();
require("dotenv").config();

const MONGODB_URI = `mongodb+srv://Mongo:${process.env.DB_URI}@cluster0-eccax.mongodb.net/shop?retryWrites=true&w=majority`;

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

// View Engine //
app.set("view engine", "ejs");

// Routes //
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// Middlewares //
const Auth = require("./middlewares/Auth");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use(
  session({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(flash())
// CSRF Token
app.use(csrfProtection);
app.use((req, res, next) => {
  app.locals.isAuthenticated = req.session.isLoggedIn;
  app.locals.csrfToken = req.csrfToken();
  next();
});

// converting the user session object to mongoose object.
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", Auth, adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Setting Mongoose //
app.use(errorController.get404);
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));

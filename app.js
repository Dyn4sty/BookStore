const path = require("path");
const express = require("express");
const errorController = require("./controllers/error");
const MongoConnect = require("./util/database").MongoConnect;
const User = require("./models/user");
const app = express();

app.set("view engine", "ejs");

// Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use((req, res, next) => {
  User.findById("5e971c3844e58b13f8b77aa2")
    .then((user) => {
      req.user = new User(user);
      next();
    })
    .catch((err) => console.log(err));
});
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use("/admin", adminRoutes);
app.use(shopRoutes);


app.use(errorController.get404);
MongoConnect(() => {
  app.listen(5000);
});

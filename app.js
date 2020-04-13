const path = require("path");
const express = require("express");
const errorController = require("./controllers/error");
const db = require('./util/database')

const app = express();

app.set("view engine", "ejs");

// Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json())
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

app.listen(5000);

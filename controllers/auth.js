const User = require("../models/user");
const bcrypt = require("bcryptjs");
getLogin = (req, res, next) => {
  if (req.session.isLoggedIn) return res.redirect("/products");
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};
getSignup = (req, res, next) => {
  if (req.session.isLoggedIn) return res.redirect("/products");
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign up",
    isAuthenticated: false,
  });
};

postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (!user) return res.redirect("/login");
    bcrypt.compare(password, user.password).then((result) => {
      if (!result) return res.redirect("/login");
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/products");
      });
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
};

postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || password !== confirmPassword) {
    return res.status(400).json('incorrect form submission');
  }
  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) return res.redirect("/signup");
      bcrypt.hash(password, 10).then((hashedPassword) => {
        const user = User({
          email,
          password: hashedPassword,
          cart: { products: [] },
        });
        return user.save();
      }).catch(err => console.log(err));
    })
    .then((result) => res.redirect("/login"))
    .catch(err => console.log(err));
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
};
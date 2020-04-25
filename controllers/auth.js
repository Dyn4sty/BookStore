const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const User = require("../models/user");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

getLogin = (req, res, next) => {
  if (req.session.isLoggedIn) return res.redirect("/products");
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: req.flash("error"),
  });
};

getSignup = (req, res, next) => {
  if (req.session.isLoggedIn) return res.redirect("/products");
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign up",
    errorMessage: req.flash("error"),
  });
};

postLogin = (req, res, next) => {
  if (req.session.isLoggedIn) return res.redirect("/products");
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (!result) return res.redirect("/login");
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save((err) => {
            console.log(err);
            res.redirect("/products");
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

postSignup = (req, res, next) => {
  if (req.session.isLoggedIn) return res.redirect("/products");
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || password !== confirmPassword) {
    req.flash("error", "Incorrect form submission.");
    return res.redirect("/signup");
  }
  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email is already used.");
        return res.redirect("/signup");
      }
      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          const user = User({
            email,
            password: hashedPassword,
            cart: { products: [] },
          });
          user.save().then((result) => {
            res.redirect("/login");
            var mailOptions = {
              from: process.env.EMAIL_ADDRESS,
              to: email,
              subject: "Signup Succeeded",
              text: "That was easy!",
            };

            transporter.sendMail(mailOptions, (error, info) => {
              console.log(error ? error : `Email sent: ${info.response}`);
            });
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

getReset = (req, res, next) => {
  if (req.session.isLoggedIn) return res.redirect("/products");
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: req.flash("error"),
  });
};

postReset = (req, res, next) => {
  const { email } = req.body;
  crypto.randomBytes(32, (error, buffer) => {
    if (error) return res.redirect("/reset");
    const token = buffer.toString("hex");
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset")
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        user.save().then((result) => {
          var mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: "Reset your password for BookStore",
            html: `<p>Hello,</p>
          
          <p>Follow this link to reset your BookStore password for your ${
            email.split("@")[0]
          } account.</p>
          
          <p>http://localhost:5000/new-password/${token}</p>
          
          <p>If you didn’t ask to reset your password, you can ignore this email.</p>
          
          Thanks,<br>
          
          Your BookStore team`,
          };
  
          transporter.sendMail(mailOptions, (error, info) => {
            console.log(error ? error : `Email sent: ${info.response}`);
          });
          res.redirect("/login");
        });
      })
      .catch((err) => console.log(err));
  });
};

getNewPassword = (req, res, next) => {
  if (req.session.isLoggedIn) return res.redirect("/products");
  const { resetToken } = req.params;
  User.findOne({ resetToken, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        req.flash("error", "Error has Occured. Please try Again later..");
        return res.redirect("/reset");
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: req.flash("error"),
        userId: user._id.toString(),
        resetToken,
      });
    })
    .catch((err) => console.log(err));
};
postNewPassword = (req, res, next) => {
  const { password, confirmPassword, userId, resetToken } = req.body;
  let resetUser;
  if (!password || password !== confirmPassword) {
    req.flash("error", "Incorrect form submission.");
    return res.redirect(`/new-password/${resetToken}`);
  }
  User.findOne({
    _id: userId,
    resetToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetTokenExpiration = undefined;
      resetUser.resetToken = undefined;
      return resetUser.save()
    }).then(result => res.redirect('/login'))
    .catch((err) => console.log(err));
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
};

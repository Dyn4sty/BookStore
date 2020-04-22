const Product = require("../models/product");
const Order = require("../models/order");
getProducts = (req, res) => {
  // console.log(req.session)
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

getProduct = (req, res) => {
  const { productId } = req.params;
  Product.findById(productId).then((product) => {
    // Checking if Product Exists
    if (!product) return res.redirect("/products");
    res.render("shop/product-detail", {
      product,
      pageTitle: product.title,
      path: `/products`,
      isAuthenticated: req.session.isLoggedIn
    });
  });
};

getIndex = (req, res, next) => {
  res.render("shop/index", {
    pageTitle: "Shop",
    path: "/",
    isAuthenticated: req.session.isLoggedIn
  });
};

getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        products,
        pageTitle: "Your Cart",
        path: "/cart",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

postCart = (req, res, next) => {
  let { productId } = req.body;
  Product.findById(productId)
    .then((cartItemToAdd) => {
      return req.user.addToCart(cartItemToAdd);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

postCartDeleteProduct = (req, res) => {
  const { productId } = req.body;
  req.user
    .deleteItemFromCart(productId)
    .then((response) => {
      if (!response) {
        return res.status(200);
      }
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

getOrders = (req, res, next) => {
  Order.find({ "user._id": req.user._id }).then((orders) => {
    res.render("shop/orders", {
      orders,
      pageTitle: "Your Orders",
      path: "/orders",
      isAuthenticated: req.session.isLoggedIn
    });
  });
};

postOrders = (req, res) => {
  req.user
    .getCart()
    .then((products) => {
      const order = new Order({
        user: req.user.toObject(),
        products,
      });
      return order.save();
    })
    .then((order) => {
      if (order) {
        return req.user.clearCart();
      }
      return res.redirect("/cart");
    })
    .then(() => res.redirect("/orders"))
    .catch((err) => console.log(err));
};

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  postCartDeleteProduct,
  getOrders,
  postOrders,
};

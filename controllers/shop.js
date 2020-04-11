const Product = require("../models/product");

getProducts = (req, res, next) => {
  const products = Product.fetchAll();
  res.render("shop/product-list", {
    products,
    pageTitle : "All Products",
    path: "/products",
  });
};

getIndex = (req, res, next) => {
  const products = Product.fetchAll();
  res.render("shop/index", {
    products,
    pageTitle : "Shop",
    path: "/",
  });
};

getCart = (req, res, next) => {
  const products = Product.fetchAll();
  res.render("shop/cart", {
    products,
    pageTitle : "Your Cart",
    path: "/cart",
  });
};

getOrders = (req, res, next) => {
  const products = Product.fetchAll();
  res.render("shop/orders", {
    products,
    pageTitle : "Your Orders",
    path: "/orders",
  });
};

getCheckout = (req, res, next) => {
  const products = Product.fetchAll();
  res.render("shop/checkout", {
    products,
    pageTitle : "Checkout",
    path: "/checkout",
  });
};

module.exports = {
  getProducts,
  getIndex,
  getCart,
  getOrders,
  getCheckout,
};

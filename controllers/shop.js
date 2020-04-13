const Product = require("../models/product");
const Cart = require("../models/cart");
getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) => {
      res.render("shop/product-list", {
        products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.FetchItemById(productId).then(([[product]]) => {
    // Checking if Product Exists
    if (!product) return res.redirect("/products");
    res.render("shop/product-detail", {
      product,
      pageTitle: product.title,
      path: `/products`,
    });
  });
};

getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) => {
      res.render("shop/index", {
        products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

getCart = (req, res, next) => {
  const products = Product.fetchAll();
  res.render("shop/cart", {
    products,
    pageTitle: "Your Cart",
    path: "/cart",
  });
};
postCart = (req, res, next) => {
  const { productId } = req.body;
  const cartItemToAdd = Product.FetchItemById(productId);
  Cart.addProduct(cartItemToAdd);
  res.status(200).json("gj");
  // res.redirect('/products')
};

getOrders = (req, res, next) => {
  const products = Product.fetchAll();
  res.render("shop/orders", {
    products,
    pageTitle: "Your Orders",
    path: "/orders",
  });
};

getCheckout = (req, res, next) => {
  const products = Product.fetchAll();
  res.render("shop/checkout", {
    products,
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  getOrders,
  getCheckout,
};

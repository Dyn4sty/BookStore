const Product = require("../models/product");
const Cart = require("../models/cart");

getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
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
  Product.findByPk(productId).then((product) => {
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
  res.render("shop/index", {
    pageTitle: "Shop",
    path: "/",
  });
};

getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      cart.getProducts().then((products) => {
        res.render("shop/cart", {
          products,
          pageTitle: "Your Cart",
          path: "/cart",
        });
      });
    })
    .catch((err) => console.log(err));
};

postCart = (req, res, next) => {
  let { productId } = req.body; 
  let fetchedCart; 
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length) {
        product = products[0];
      }

      // Product Exists, Incrementing the quantity.
      if (product) {
        oldQuantity = product.cartItem.quantity;
        newQuantity += oldQuantity;
      }

      // Fetching the Product
      return Product.findByPk(productId);
    })

    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: {
          quantity: newQuantity,
        },
      });
    })

    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};

getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
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

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
        return product.cartItem
          .increment("quantity", { by: 1 })
          .then(() => res.redirect("/cart"))
          .catch((err) => console.log(err));
      }

      // Fetching the Product
      return Product.findByPk(productId);
    })

    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: {
          quantity: 1,
        },
      });
    })

    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
};

postCartDeleteProduct = (req, res) => {
  const { productId } = req.body;
  req.user
    .getCart()
    .then((cart) => {
      cart
        .getProducts({ where: { id: productId } })
        .then((products) => {
          let product;
          if (products.length) {
            product = products[0];
          }
          if (!product) return res.redirect("/");

          return cart.removeProduct(product);
        })
        .then((response) => {
          if (!response) {
            return res.status(200);
          }
          res.redirect("/cart");
        });
    })

    .catch((err) => console.log(err));
};

getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};

postOrders = (req, res) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
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
  getOrders,
  postOrders,
  postCartDeleteProduct,
};

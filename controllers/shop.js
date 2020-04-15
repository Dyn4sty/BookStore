const Product = require("../models/product");

getProducts = (req, res, next) => {
  Product.fetchAll()
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
  Product.findById(productId).then((product) => {
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
    .then((products) => {
      res.render("shop/cart", {
        products,
        pageTitle: "Your Cart",
        path: "/cart",
      });
    })
    .catch((err) => console.log(err));
};

postCart = (req, res, next) => {
  let { productId } = req.body;
  Product.findById(productId)
    .then((product) => {
      // Checking if Product Exists
      if (!product) return res.redirect("/cart");
      return req.user.addToCart(product);
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

// getOrders = (req, res, next) => {
//   res.render("shop/orders", {
//     pageTitle: "Your Orders",
//     path: "/orders",
//   });
// };

// postOrders = (req, res) => {
//   req.user
//     .getCart()
//     .then((cart) => {
//       return cart.getProducts();
//     })
//     .then((products) => {
//       return req.user
//         .createOrder()
//         .then((order) => {
//           order.addProducts(
//             products.map((product) => {
//               product.orderItem = { quantity: product.cartItem.quantity };
//               return product;
//             })
//           );
//         })
//         .catch((err) => console.log(err));
//     })
//     .then(() => res.redirect("/orders"))
//     .catch((err) => console.log(err));
// };

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  postCartDeleteProduct,
  // getOrders,
  // postOrders,
};

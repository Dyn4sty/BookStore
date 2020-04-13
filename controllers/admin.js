const Product = require("../models/product");

getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

postAddProduct = (req, res, next) => {
  const product = new Product(req.body);
  product
    .saveProduct()
    .then((resp) => {
      if (resp[0].affectedRows) {
        return res.redirect("/products");
      }
      res.status(200).json("failed");
    })
    .catch((err) => {
      res.status(200).json("failed");
    });
};

getProducts = (req, res, next) => {
  const products = Product.fetchAll();
  res.render("admin/products", {
    products,
    pageTitle: "Admin Products",
    path: "/admin/products",
  });
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
};

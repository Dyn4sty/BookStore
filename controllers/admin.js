const Product = require("../models/product");

getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle : "Add Product",
    path: "/admin/add-product",
  });
};

postAddProduct = (req, res, next) => {
  const product = new Product({ ...req.body });
  product.saveProduct();
  res.redirect("/products");
};

getProducts = (req, res, next) => {
  const products = Product.fetchAll();
  res.render("admin/products", {
    products,
    pageTitle : "Admin Products",
    path: "/admin/products",
  });
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
};

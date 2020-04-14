const Product = require("../models/product");

getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

postAddProduct = (req, res, next) => {
  req.user.createProduct(req.body)
    .then((response) => res.redirect("/products"))
    .catch((err) => console.log(err));
};

getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

getEditProduct = (req, res) => {
  const { edit } = req.query;
  if (edit !== "true") return res.redirect("/");
  const { productId } = req.params;
  Product.findByPk(productId).then((product) => {
    if (!product) res.redirect("/");
    res.render("admin/edit-product", {
      product,
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: edit,
    });
  });
};

postEditProduct = (req, res, next) => {
  const { productId, ...propsToUpdate } = req.body;
  Product.update(propsToUpdate, { where: { id: productId } })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.destroy({ where: { id: productId } })
    .then((result) => {
      if (result) console.log("PRODUCT Removed!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};

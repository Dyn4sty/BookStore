const path = require("path");
const fs = require("fs");
const db = require("../util/database");

module.exports = class Product {
  constructor(props) {
    Object.assign(this, props);
  }

  saveProduct = () => {
    return db.execute(
      "INSERT INTO `products` (`title`, `price`, `description`, `imageUrl`) VALUES (?, ?, ?, ?); ",
      [this.title, this.price, this.description, this.imageUrl]
    );
  };

  static fetchAll = () => {
    return db.execute("SELECT * FROM products");
  };

  static FetchItemById = (productId) => {
    return db.execute("SELECT * FROM `products` WHERE `id` = ? ", [productId]);
  };
};

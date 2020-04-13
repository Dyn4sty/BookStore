const fs = require("fs");
const path = require("path");

const filePath = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(cartItemToAdd) {
    fs.readFile(filePath, (err, fileContent) => {
      let cart = {
        products: [],
        totalPrice: 0,
      };

      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => find existing product
      const existingCartItem = cart.products.find(
        (cartItem) => cartItem.id === cartItemToAdd.id
      );

      // Add New Product / incrase quantity
      if (existingCartItem) {
        cart.products = cart.products.map((product) =>
          product.id === cartItemToAdd.id
            ? { ...product, quantity: product.quantity + 1 }
            : product
        );
      } else {
        cart.products = [...cart.products, { ...cartItemToAdd, quantity: 1 }];
      }

      cart.totalPrice += parseInt(cartItemToAdd.price);

      fs.writeFile(filePath, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
};

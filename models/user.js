const mongoose = require("mongoose");

const { Schema } = mongoose;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    products: [
      {
        productId: Schema.Types.ObjectId,
        _id: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

// Cart Methods //
userSchema.methods.clearCart = function () {
  this.cart.products = [];
  return this.save();
};
userSchema.methods.addToCart = function (cartItemToAdd) {
  // if (!cartItemToAdd) return res.redirect("/cart");
  const existingCartItem = this.cart.products.find(
    (cartItem) => cartItem._id.toString() === cartItemToAdd._id.toString()
  );
  if (existingCartItem) {
    this.cart.products = this.cart.products.map((cartItem) =>
      cartItem._id.toString() === cartItemToAdd._id.toString()
        ? {
            productId: cartItemToAdd._id,
            _id: cartItem._id,
            quantity: cartItem.quantity + 1,
          }
        : cartItem
    );
  } else {
    this.cart.products = [
      ...this.cart.products,
      { productId: cartItemToAdd._id, _id: cartItemToAdd._id, quantity: 1 },
    ];
  }
  return this.save();
};

userSchema.methods.getCart = function () {
  return this.populate("cart.products._id")
    .execPopulate()
    .then(({ cart: { products } }) => {
      return (products = products
        .filter((cartItem) => {
          if (!cartItem._id) {
            req.user.deleteItemFromCart(cartItem.productId);
            return false;
          }
          return true;
        })
        .map((cartItem) => {
          const { ...itemProps } = cartItem._id._doc;
          return {
            ...itemProps,
            quantity: cartItem.quantity,
            productId: cartItem.productId,
          };
        }));
    });
};
userSchema.methods.deleteItemFromCart = function (productId) {
  const updateCartItems = this.cart.products.filter((cartItem) => {
    cartItem.productId.toString() !== productId.toString();
  });
  this.cart.products = updateCartItems;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

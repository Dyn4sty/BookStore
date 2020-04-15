const { getDb } = require("../util/database");
const { ObjectId } = require("mongodb");

class User {
  constructor(props) {
    Object.assign(this, props);
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  getCart() {
    // Fetching the cart
    const db = getDb();
    let { products } = this.cart;

    /* 
        getting the cart Products ids, Fetching the Actual Items from DB.
        mapping thorught the actual items and adding the quantity from the cart.
        map returning array of promises, Promise.All return promise of the solved array. 
        while mapping, if the item dosent exist anymore, we remove him from the db.
     */

    return Promise.all(
      products.map((cartItem) => {
        return db
          .collection("products")
          .findOne({ _id: ObjectId(cartItem._id) })
          .then((shopProduct) => {
            if (!shopProduct) this.deleteItemFromCart(cartItem._id);
            let newCartItem = { ...shopProduct, quantity: cartItem.quantity };
            return newCartItem;
          })
          .catch((err) => console.log(err));
      })
    ).then((products) => {
      // --- checking for non-existing products ---

      products = products.filter((item) => item._id);
      return products;
    });
  }

  addToCart(cartItemToAdd) {
    const db = getDb();
    // Item Exists in the cart?
    const existingCartItem = this.cart.products.find(
      (cartItem) => cartItem._id.toString() === cartItemToAdd._id.toString()
    );

    // True. -> Incrementing the quantity
    if (existingCartItem) {
      this.cart.products = this.cart.products.map((cartItem) =>
        cartItem._id.toString() === cartItemToAdd._id.toString()
          ? {
              _id: cartItem._id,
              quantity: cartItem.quantity + 1,
            }
          : cartItem
      );
    }
    // False -> Add to cart.
    else {
      this.cart.products = [
        ...this.cart.products,
        { _id: cartItemToAdd._id, quantity: 1 },
      ];
    }
    return db
      .collection("users")
      .updateOne({ _id: Object(this._id) }, { $set: { cart: this.cart } });
  }

  deleteItemFromCart(productId) {
    const db = getDb();
    const updateCartItems = this.cart.products.filter(
      (cartItem) => cartItem._id.toString() !== productId.toString()
    );
    return db
      .collection("users")
      .updateOne(
        { _id: Object(this._id) },
        { $set: { cart: { products: updateCartItems } } }
      );
  }

  static findById(userId) {
    const db = getDb();
    return db.collection("users").findOne({ _id: ObjectId(userId) });
  }
}

module.exports = User;

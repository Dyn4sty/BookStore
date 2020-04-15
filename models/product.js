const { getDb } = require("../util/database");
const { ObjectId } = require("mongodb");

class Product {
  constructor(props) {
    Object.assign(this, props);
  }

  save() {
    const db = getDb();
    return db.collection("products").insertOne(this);
  }

  static fetchAll() {
    const db = getDb();
    return db.collection("products").find({}).toArray();
  }
  static findById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .findOne({ _id: ObjectId(productId) })
  }
  static updateById(productId, props) {
    const db = getDb();
    return db
      .collection("products")
      .updateOne({ _id: ObjectId(productId) }, { $set: props });
  }
  static deleteById(productId) {
    const db = getDb();
    return db.collection("products").deleteOne({ _id: ObjectId(productId) });
  }
}

module.exports = Product;

const MongoClient = require("mongodb").MongoClient;
require('dotenv').config()
let _db;

const MongoConnect = (callback) => {
  const uri =
    `mongodb+srv://Mongo:${process.env.DB_URI}@cluster0-eccax.mongodb.net/shop?retryWrites=true&w=majority`;
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
      console.log("Connected!");
      _db = client.db()
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
}
module.exports = {
    MongoConnect,
    getDb
};

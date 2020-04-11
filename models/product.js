const path = require("path");
const fs = require("fs");

const filePath = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

module.exports = class Product {
  constructor(props) {
    Object.assign(this, props);
  }

  saveProduct = () => {
    fs.readFile(filePath, (err, fileContent) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileContent);
      }
      products.push(this);
      fs.writeFile(filePath, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  };

  static fetchAll = () => {
    let products;
    try {
      products = fs.readFileSync(filePath, 'utf8')
    }
    catch (err) {
      return [];
    }
    return JSON.parse(products)
  };
};

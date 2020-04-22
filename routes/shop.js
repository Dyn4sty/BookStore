const express = require("express");
const shopController = require("../controllers/shop");
const router = express.Router();
const Auth = require("../middlewares/Auth")
router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/orders", Auth, shopController.getOrders);

router.post("/create-order", Auth, shopController.postOrders);

router.get("/cart", Auth,  shopController.getCart);

router.post("/cart", Auth, shopController.postCart);

router.post("/cart-delete-item", Auth, shopController.postCartDeleteProduct);
    
module.exports = router;

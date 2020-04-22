const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema({
  user: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  products: [
    {
        title: { type: String, required: true },
        imageUrl: { type: String, required: true },
        price: { type: String, required: true },
        description: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Order", orderSchema);

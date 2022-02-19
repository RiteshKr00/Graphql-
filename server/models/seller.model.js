const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  sellername: String,
  product: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  }],
});
const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;

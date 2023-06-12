const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    Phone: { type: Number, required: true },
    Address: { type: String, required: true },
    Price: { type: Number, required: true },
    forSale:{type:Boolean ,required:true},
    forRent:{type:Boolean ,required:true},
    myImage: [{ type: String }]
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("product", productSchema);

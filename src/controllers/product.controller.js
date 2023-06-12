const express = require("express");

const Product = require("../models/product.model");

const authenticate = require("../middleware/authenticate");
const authorise = require("../middleware/authorize");

const {upload,uploadSingle} = require("../middleware/fileupload")
const router = express.Router();

const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
  cloud_name: 'dnjbsbyl1', 
  api_key: '384385657135592', 
  api_secret:'DQvue62Uc5c7acDfdQwanriAO8I' 
});

router.post("/",uploadSingle("myImage"),async(req, res) => {

  
  try {
    const result =await cloudinary.uploader.upload(req.file.path)
      const product =  await Product.create({
        Name:req.body.Name,
        Email:req.body.Email,
        Phone:req.body.Phone,
        Address:req.body.Address,
        Price:req.body.Price,
        forSale:req.body.forSale, 
        forRent:req.body.forRent,
         myImage: result.url,
     });
     console.log(result)
      return res.send(product);
    } catch (err) {
      console.log(err)
      return res.status(500).send({ message: err.message });
     }

 })
 

router.patch(
  "/:id",
  // authenticate,
  authorise(["seller", "admin"]),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      return res.send(product);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  }
);

router.get("", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const size = req.query.size || 5;

    const products = await Product.find()
    .skip((page -1)*size)
    .limit(size)
    .lean().exec();

    const totalPages = Math.ceil((await Product.find().countDocuments()) / size);

    return res.send({ products, totalPages });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;

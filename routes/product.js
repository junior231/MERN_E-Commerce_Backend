const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// initialize express router
const router = require("express").Router();

// CREATE PRODUCT
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    if (savedProduct) {
      res.status(200).json(savedProduct);
    }
  } catch (error) {
    res.status(500).json(err);
  }
});

// GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const newQuery = req.query.new;
  const categoryQuery = req.query.category;

  try {
    let products;

    if (newQuery) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (categoryQuery) {
      products = await Product.find({
        categories: {
          $in: [categoryQuery],
        },
      });
    } else {
      products = await Product.find();
    }

    if (products) {
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE PRODUCT
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await User.findByIdAndUpdate(
      req.params.id,
      {
        // set new values
        $set: req.body,
      },
      { new: true }
    );
    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// DELETE PRODUCT
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

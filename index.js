const express = require("express");
const { initializeDatabase } = require("./db/db.connect");
const Product = require("./model/product.model");
const Category = require("./model/category.model");
require("dotenv").config();
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3001;
const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.post("/api/products", async (req, res) => {
  try {
    const {
      productImage,
      productName,
      productPrice,
      productRating,
      discount,
      category,
    } = req.body;

    if (
      !productImage ||
      !productName ||
      !productPrice ||
      !productRating ||
      !category
    ) {
      return res.status(400).json({ error: "Enter required product data" });
    }
    const createProduct = new Product({
      productImage,
      productName,
      productPrice,
      productRating,
      discount,
      category,
    });
    const saveProduct = await createProduct.save();
    return res
      .status(201)
      .json({ message: "Product data saved", product: saveProduct });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Failed to save data" });
  }
});
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    if (products.length === 0) {
      return res.status(404).json({ error: "Products not found" });
    }
    return res.status(200).json({ data: { products } });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Unable to fetch data" });
  }
});
app.get("/api/products/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (product) {
      return res.status(200).json({ data: { product } });
    }
    return res.status(404).json({ error: "Product not found" });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Unable to fetch data" });
  }
});
app.post("/api/categories", async (req, res) => {
  try {
    const { category, categoryImage } = req.body;
    if (!category) {
      return res.status(400).json({ error: "Enter required category data" });
    }
    const createCategory = new Category({ category, categoryImage });
    const saveCategory = await createCategory.save();
    return res
      .status(201)
      .json({ message: "Category data saved", categories: saveCategory });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Failed to save data" });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      return res.status(404).json({ error: "Categories not found" });
    }
    return res.status(200).json({ data: { categories } });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Unable to fetch data" });
  }
});
app.listen(PORT, () => {
  console.log("Server running on Port", PORT);
});
initializeDatabase();

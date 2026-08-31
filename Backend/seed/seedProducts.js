const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../Models/Product");
const User = require("../Models/User");

dotenv.config();

const seedFromDummyJSON = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding...");

    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log("No admin user found! Make at least one user admin first.");
      process.exit(1);
    }

    await Product.deleteMany();
    console.log("Old products cleared.");

    const { data } = await axios.get("https://dummyjson.com/products?limit=194");
    const items = Array.isArray(data) ? data : data?.products || [];

    if (!items.length) {
      console.log("No products found from DummyJSON.");
      process.exit(0);
    }

    const products = items.map((item) => ({
      name: item.title,
      description: item.description,
      price: Math.round(item.price * 80),
      category: item.category,
      brand: item.brand || "Generic",
      stock: Number.isFinite(item.stock) ? item.stock : 10,
      image: Array.isArray(item.images) && item.images.length
        ? item.images.map((url) => ({ url }))
        : [{ url: item.thumbnail || "https://via.placeholder.com/600x400?text=Product" }],
      rating: typeof item.rating === "number" ? item.rating : item.rating?.rate || 0,
      numReviews: typeof item.rating === "number" ? 0 : item.rating?.count || 0,
      user: adminUser._id,
    }));

    await Product.insertMany(products);
    console.log(`${products.length} products inserted successfully!`);
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedFromDummyJSON();
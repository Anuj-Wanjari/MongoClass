const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require('dotenv').config()

app.use(express.json());


mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Failed to connect to MongoDB", err);
    });

// Product Schema
const ProductSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_price: {
        type: Number, 
        required: true
    },
    isInStock: {
        type: Boolean,
        required: true
    },
    Category: {
        type: String,
        required: true
    }
});

const Product = mongoose.model("Product", ProductSchema);

// Create new product
app.post('/api/products', async (req, res) => {
    const product = new Product({
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        isInStock: req.body.isInStock,
        Category: req.body.Category
    });

    try {
        const savedProduct = await product.save();
        console.log(savedProduct);
        return res.status(201).json({ message: "Product created successfully", product: savedProduct });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const allProducts = await Product.find({});
        return res.json(allProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Update product by ID
app.put('/api/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Delete product by ID
app.delete('/api/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

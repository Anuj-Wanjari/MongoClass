const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

mongoose
    .connect(
        "mongodb+srv://anujwanjari5:Anuj12345@cluster0.fql1c22.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Failed", err);
    });

// ProductSchema
const ProductSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_price: {
        type: String,
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

// Create a new product
app.post('/api/products', async (req, res) => {
    try {
        const product = await Product.create({
            product_name: req.body.product_name,
            product_price: req.body.product_price,
            isInStock: req.body.isInStock,
            Category: req.body.Category
        });

        console.log(product);
        return res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

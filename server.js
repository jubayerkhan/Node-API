const express = require('express');
const cors = require('cors')
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/productModel')
const fs = require('fs')
const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the folder to save the uploaded files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Ensure unique filenames
    }
});
const upload = multer({ storage: storage });

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//routes

app.get('/', (req, res) => {
    res.send('Hello Node API 1')
})

app.get('/blog', (req, res) => {
    res.send('Hello Blog, My name is JK')
})

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.post('/products', upload.single('file'), async (req, res) => {
    try {
        const { name, mobile, quantity, price, detail } = req.body;
        const file = req.file; // Multer attaches the file object here

        // Check if a file was uploaded
        let imagePath = '';
        if (file) {
            imagePath = `http://localhost:3000/${file.path.replace(/\\/g, '/')}`; // Store the file path (for use in the frontend)
        }

        // Create the product object
        const product = new Product({
            name,
            mobile,
            quantity,
            price,
            detail,
            image: imagePath, // Save the file path in the product details
        });

        // Save the product to the database
        await product.save();

        // Respond with the saved product
        res.status(200).json(product);
    } catch (error) {
        console.error('Error saving product:', error.message);
        res.status(500).json({ message: error.message });
    }
});

//update a product
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        // no product found at database
        if (!product) {
            return res.status(404).json({ message: `can not find any product with ID: ${id}` })
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//delete product
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: `can not find any product with ID: ${id}` })
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

mongoose.set("strictQuery", false)

mongoose.connect('mongodb+srv://jubayerkhab741:UHn1Dh3OCvTtKl6U@dev-api.vzifb.mongodb.net/Node-API?retryWrites=true&w=majority&appName=dev-API')
    .then(() => {
        console.log('connected to api')
        app.listen(3000, () => {
            console.log('Node API app is running on port 3000')
        })
    })
    .catch(() => {
        console.log(eroror)
    })
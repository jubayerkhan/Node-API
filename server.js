const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const Product = require('./models/productModel')
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

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

app.post('/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
})

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
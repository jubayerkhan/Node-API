const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a product name']
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    },
    {
        timestamps: true
    },
)

const Product = mongoose.model('User', userSchema);
module.exports = User;
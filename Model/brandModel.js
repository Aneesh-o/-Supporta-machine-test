const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true,
        trim: true
    },
    brandLogo: {
        type: String
    },
    categories: {
        type: [String], 
        default: []
    }
}, { timestamps: true });

const brands = mongoose.model('brands', brandSchema);

module.exports = brands;

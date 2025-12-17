const mongoose = require('mongoose');

const furnitureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageURL: {
        type: String, // Optional if modelURL is present
    },
    modelURL: {
        type: String, // Optional GLB/GLTF URL for real AR
        default: '',
    },
    dimensions: {
        width: Number,
        height: Number,
        depth: Number,
    },
    category: {
        type: String,
        required: true, // e.g., 'Sofa', 'Table', 'Chair'
    },
}, { timestamps: true });

module.exports = mongoose.model('Furniture', furnitureSchema);

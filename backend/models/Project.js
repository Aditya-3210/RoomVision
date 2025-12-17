const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    roomImageURL: {
        type: String,
        required: true, // URL to the uploaded room background
    },
    itemsUsed: [
        {
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Furniture',
            },
            imageURL: String, // Store snapshot of properties if needed
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 },
            width: Number,
            height: Number,
            rotation: { type: Number, default: 0 },
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);

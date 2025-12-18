const Furniture = require('../models/Furniture');

exports.getAllFurniture = async (req, res) => {
    try {
        const furniture = await Furniture.find().sort({ createdAt: -1 });
        res.json(furniture);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.addFurniture = async (req, res) => {
    try {
        const { name, imageURL, dimensions, category, modelURL, modelThumbnailURL } = req.body;
        const newFurniture = new Furniture({
            name,
            imageURL,
            dimensions,
            category,
            modelURL,
            modelThumbnailURL
        });
        await newFurniture.save();
        res.status(201).json(newFurniture);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.updateFurniture = async (req, res) => {
    try {
        const updatedFurniture = await Furniture.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFurniture) return res.status(404).json({ message: 'Furniture not found' });
        res.json(updatedFurniture);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteFurniture = async (req, res) => {
    try {
        const furniture = await Furniture.findById(req.params.id);
        if (!furniture) return res.status(404).json({ message: 'Furniture not found' });
        await furniture.deleteOne();
        res.json({ message: 'Furniture removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

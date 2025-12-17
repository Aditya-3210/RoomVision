const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Furniture = require('./models/Furniture');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const sampleFurniture = [
    {
        name: 'Modern Sofa',
        imageURL: 'https://cdn-icons-png.flaticon.com/512/2558/2558025.png', // Placeholder
        dimensions: { width: 200, height: 80, depth: 90 },
        category: 'Sofa'
    },
    {
        name: 'Wooden Table',
        imageURL: 'https://cdn-icons-png.flaticon.com/512/1663/1663942.png',
        dimensions: { width: 120, height: 60, depth: 60 },
        category: 'Table'
    },
    {
        name: 'Office Chair',
        imageURL: 'https://cdn-icons-png.flaticon.com/512/207/207123.png',
        dimensions: { width: 60, height: 60, depth: 60 },
        category: 'Chair'
    },
    {
        name: 'Floor Lamp',
        imageURL: 'https://cdn-icons-png.flaticon.com/512/3034/3034293.png',
        dimensions: { width: 40, height: 160, depth: 40 },
        category: 'Lighting'
    }
];

const seedDB = async () => {
    try {
        await Furniture.deleteMany({});
        await Furniture.insertMany(sampleFurniture);
        console.log('Database Seeded!');
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();

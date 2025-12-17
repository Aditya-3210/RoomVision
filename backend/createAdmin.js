const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const createAdmin = async () => {
    try {
        const email = 'admin@example.com';
        const password = 'adminpassword';

        // Check if exists
        let user = await User.findOne({ email });
        if (user) {
            console.log('Admin user already exists');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name: 'Admin User',
            email,
            password: hashedPassword,
            role: 'admin'
        });

        await user.save();
        console.log(`Admin created successfully!\nEmail: ${email}\nPassword: ${password}`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();

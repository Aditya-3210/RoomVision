const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/furniture', require('./routes/furnitureRoutes'));
app.use('/projects', require('./routes/projectRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
  res.send('AR Interior Design Planner API Running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

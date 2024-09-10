
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express
const app = express();
app.use(bodyParser.json());

// MongoDB URI - Replace with your actual MongoDB connection string
const mongoURI = "mongodb+srv://manoj:manoj@chaincraft.berpx.mongodb.net/?retryWrites=true&w=majority&appName=ChainCraft";
;

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schema for Sensor Data
const sensorDataSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now }
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

// API endpoint to receive data from ESP32
app.post('/api/data', async (req, res) => {
  try {
    const { temperature, humidity, latitude, longitude } = req.body;

    const newSensorData = new SensorData({ temperature, humidity, latitude, longitude });
    await newSensorData.save();

    res.status(201).send({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

// Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

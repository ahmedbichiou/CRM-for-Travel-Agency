const express = require('express');
const mongoose = require('mongoose');
const createCrudRoutes = require('./routes/genericCrudRoutes');
const uploadRoute = require('./maptomap');
const { ProductType, ProductLocation, ProductStatus, ProductSubType, Pension, Fournisseur, Description } = require('./models/Product');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const jwt = require('jsonwebtoken');
// Define your MongoDB connection string
const query = 'mongodb+srv://flameonvanced:7k5GMskzup8T1LeJ@travelagency.0ohfclh.mongodb.net/Agency?retryWrites=true&w=majority&appName=TravelAgency';
//eee
// Connect to MongoDB
mongoose.connect(query)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        // Initialize GridFSBucket after connection is established
        const db = mongoose.connection.db;
        app.locals.bucket = new mongoose.mongo.GridFSBucket(db, {
            bucketName: 'photos'
        });
    })
    .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

// Register CRUD routes for related models
app.use('/api/product-types', createCrudRoutes(ProductType, 'Product Type'));
app.use('/api/product-description', createCrudRoutes(Description, 'Product Type'));
app.use('/api/product-locations', createCrudRoutes(ProductLocation, 'Product Location'));
app.use('/api/product-statuses', createCrudRoutes(ProductStatus, 'Product Status'));
app.use('/api/product-subtypes', createCrudRoutes(ProductSubType, 'Product Sub-Type'));
app.use('/api/pensions', createCrudRoutes(Pension, 'Pension'));
app.use('/api/fournisseurs', createCrudRoutes(Fournisseur, 'Fournisseur'));


// Register CRUD routes for products (with relations)
const searchRoutes = require('./routes/searchRoutes');
app.use('/api/search',searchRoutes);
app.use('/api',uploadRoute);
const GeneralDescriptionRoutes = require('./routes/generaldescriptionRoutes');
app.use('/api/general-description',GeneralDescriptionRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Register CRUD routes for photos
const photoRoutes = require('./routes/PhotoRoutes');
app.use('/api/photos', photoRoutes)

const authRoutes = require('./routes/auth');;
app.use('/api/auth', authRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle errors and undefined routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;


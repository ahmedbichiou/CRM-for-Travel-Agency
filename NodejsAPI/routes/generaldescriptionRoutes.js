const express = require('express');
const router = express.Router();
const { GeneralDescription } = require('../models/Product'); 
const { Product } = require('../models/Product');
// GET all general descriptions
router.get('/', async (req, res) => {
    try {
        const items = await GeneralDescription.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve general descriptions', error });
    }
});

// GET a single general description by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await GeneralDescription.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'General description not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve general description', error });
    }
});

// POST a new general description
router.post('/', async (req, res) => {
    try {
        const newItem = new GeneralDescription(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create general description', error });
    }
});

// PUT update an existing general description by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await GeneralDescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: 'General description not found' });
        }
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update general description', error });
    }
});

// DELETE a general description by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await GeneralDescription.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'General description not found' });
        }
        res.status(204).json({ message: 'General description deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete general description', error });
    }
});
router.post('/:id/add-product', async (req, res) => {
    try {
        const { productId } = req.body;

        // Check if productId is provided
        if (!productId) {
            return res.status(400).json({ message: 'ProductId is required' });
        }

        // Find the general description by ID
        const generalDescription = await GeneralDescription.findById(req.params.id);

        if (!generalDescription) {
            return res.status(404).json({ message: 'General description not found' });
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product is already associated with the general description
        if (generalDescription.products.includes(productId)) {
            // Skip adding the product and return success
            return res.status(200).json({ message: 'Product already associated with this general description', generalDescription });
        }

        // Add the product to the products array
        generalDescription.products.push(productId);
        await generalDescription.save();

        res.status(200).json({ message: 'Product added to general description', generalDescription });
    } catch (error) {
        console.error('Error adding product to general description:', error); // Log the error to console
        res.status(500).json({ message: 'Failed to add product to general description', error: error.message || error });
    }
});



router.delete('/:id/remove-product', async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'ProductId is required' });
        }

        const generalDescription = await GeneralDescription.findById(req.params.id);

        if (!generalDescription) {
            return res.status(404).json({ message: 'General description not found' });
        }

        const productIndex = generalDescription.products.indexOf(productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not associated with this general description' });
        }

        // Remove the product from the products array
        generalDescription.products.splice(productIndex, 1);
        await generalDescription.save();

        res.status(200).json({ message: 'Product removed from general description', generalDescription });
    } catch (error) {
        console.error('Error removing product from general description:', error);
        res.status(500).json({ message: 'Failed to remove product from general description', error: error.message || error });
    }
});
module.exports = router;

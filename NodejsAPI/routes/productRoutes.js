const express = require('express');
const { Product, ProductType, ProductLocation, ProductStatus, ProductSubType, Pension, Fournisseur,Description,Photo } = require('../models/Product');
const router = express.Router();
const crypto = require('crypto');
const { Url } = require('../models/Product'); 
// CRUD for Products

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
            .populate('productType')
            .populate('productLocation')
            .populate('productStatus')
            .populate('productSubType')
            .populate('pension')
            .populate('fournisseur');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/ids', async (req, res) => {
    try {
        const productIds = await Product.find().select('id');
        res.json(productIds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/check-id', async (req, res) => {
    const { id } = req.query;
    const existingProduct = await Product.findOne({ id });
    if (existingProduct) {
        return res.json({ unique: false });
    }
    res.json({ unique: true });
});

router.get('/id', async (req, res) => {
    try {
        const { id } = req.query;

        // Fetch the product and populate its references
        const product = await Product.findOne({ id })
            .populate('productType')
            .populate('productLocation')
            .populate('productStatus')
            .populate('productSubType')
            .populate('pension')
            .populate('fournisseur')
            .populate('descriptions'); // Populate descriptions

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/get-id-from-_id', async (req, res) => {
    try {
        const { _id } = req.query;

        // Fetch the product using _id
        const product = await Product.findById(_id).select('id');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ id: product.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/findbyfullid/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Ensure the ID is valid
        if (!id) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        // Find the product by its ID and populate fields
        const product = await Product.findById(id)
            .populate('productType')
            .populate('productLocation')
            .populate('productStatus')
            .populate('productSubType')
            .populate('pension')
            .populate('fournisseur')
            .exec(); // Ensure the query is executed

        // Check if product is found
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Respond with the product data
        res.json(product);
    } catch (error) {
        // Handle errors and send a response
        res.status(500).json({ message: error.message });
    }
});

// POST a new product
router.post('/', async (req, res) => {
    const { id, productName, productType, productLocation, productStatus, productSubType, pension, longitude, latitude, fournisseur } = req.body;

    const newProduct = new Product({
        id,
        productName,
        productType,
        productLocation,
        productStatus,
        productSubType,
        pension,
        longitude,
        latitude,
        fournisseur,
    });

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Function to generate checksum
function generateChecksum(content) {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(content));
    return hash.digest('hex');
}
router.put('/id', async (req, res) => {
    try {
        const { id } = req.query;
        req.body.lastEditDate = new Date();

        // Generate a new checksum based on the updated product data
        const updatedProductData = { ...req.body, lastEditDate: req.body.lastEditDate }; // Include lastEditDate in checksum calculation
        const newChecksum = generateChecksum(updatedProductData);

        // Update product with new checksum
        const updatedProduct = await Product.findByIdAndUpdate(id, { ...req.body, checksum: newChecksum }, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



router.delete('/id', async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) return res.status(400).json({ message: 'Product ID is required' });

        const product = await Product.findOne({ id });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await Description.deleteMany({ _id: { $in: product.descriptions } });
        await Url.deleteMany({ productId: product._id });
        // Delete the product itself
        await Product.findOneAndDelete({ id });

        res.json({ message: 'Product and associated descriptions and photos deleted' });
    } catch (error) {
        console.error('Error deleting product and related data:', error);
        res.status(500).json({ message: error.message });
    }
});


router.put('/add-location/:productId', async (req, res) => {
    const { productId } = req.params;  // Use params to get productId from the URL
    const { locationId } = req.body;
    
    
    try {
        // Find the location by its ID
        const location = await ProductLocation.findById(locationId);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        // Find the product by its ID
        const product = await Product.findById(productId);  // Use findById here
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product already includes the location
        if (!product.productLocation.includes(locationId)) {
            product.productLocation.push(locationId);
            product.lastEditDate = new Date();
            await product.save();
        } else {
            return res.status(400).json({ message: 'Location already added to product' });
        }

        res.status(200).json({ message: 'Location added to product successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/remove-location/:productId', async (req, res) => {
    const { productId } = req.params;
    const { locationId } = req.body;
    
    try {
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Check if locationId exists in the product's productLocation array
        if (product.productLocation.includes(locationId)) {
            // Remove locationId from the productLocation array
            product.productLocation = product.productLocation.filter(id => id.toString() !== locationId);
            await product.save();
            res.status(200).json({ message: 'Location removed from product successfully' });
        } else {
            res.status(400).json({ message: 'Location not associated with this product' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



router.post('/add-descriptions/:productId', async (req, res) => {
    const { productId } = req.params;
    const { title, family, description } = req.body;

    try {
        // Validate input
        if (!title || !family || !description) {
            return res.status(400).json({ message: 'Title, family, and description are required' });
        }

        // Find the product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Determine the order based on existing descriptions
        const existingDescriptions = await Description.find({ _id: { $in: product.descriptions } });
        const ordre = existingDescriptions.length + 1;

        // Create a new description
        const newDescription = new Description({
            title,
            family,
            description,
            ordre
        });

        // Save the new description to the database
        await newDescription.save();

        // Add the new description's ObjectId to the product
        product.descriptions.push(newDescription._id);
        product.lastEditDate = new Date();

        // Save the updated product
        await product.save();

        res.status(201).json({ message: 'Description added successfully', description: newDescription });
    } catch (error) {
        console.error('Error adding description:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});



// Route to get all descriptions of a product
router.get('/get-descriptions/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        // Find the product by ID
        const product = await Product.findById(productId).select('descriptions');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Return the descriptions array
        res.status(200).json(product.descriptions);
    } catch (error) {
        console.error('Error retrieving descriptions:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Delete description from a product and re-order remaining descriptions
router.delete('/delete-descriptions/:productId', async (req, res) => {
    const { productId } = req.params;
    const { descriptionId } = req.body; // This is the ID of the description to be deleted

    try {
        // Find the product by ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the index of the description to be deleted
        const descriptionIndex = product.descriptions.findIndex(desc => desc.toString() === descriptionId);
        if (descriptionIndex === -1) {
            return res.status(404).json({ message: 'Description not found' });
        }

        // Remove the description
        product.descriptions.splice(descriptionIndex, 1);
        product.lastEditDate = new Date();

        // Reorder the remaining descriptions
        product.descriptions.forEach((desc, index) => {
            desc.ordre = index + 1; // Reassign ordre based on the new index
        });

        // Generate a new checksum based on the updated product
        const updatedProductData = { ...product.toObject(), lastEditDate: product.lastEditDate };
        const newChecksum = generateChecksum(updatedProductData);

        // Update the product with the new checksum
        product.checksum = newChecksum;
        await product.save();

        res.status(200).json({ message: 'Description deleted and reordered successfully', product });
    } catch (error) {
        console.error('Error deleting description:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});




router.patch('/specific/:productId/descriptions/:descriptionId/ordre', async (req, res) => {
    const { productId, descriptionId } = req.params;
    const { newOrdre } = req.body;

    try {
        // Find the specific description by its ID
        const descriptionToUpdate = await Description.findById(descriptionId);

        if (!descriptionToUpdate) {
            return res.status(404).json({ message: 'Description not found' });
        }

        // Update the ordre field
        descriptionToUpdate.ordre = newOrdre;

        // Save the updated description
        await descriptionToUpdate.save();

        res.status(200).json({ message: 'Description ordre updated successfully', description: descriptionToUpdate });
    } catch (error) {
        console.error('Error updating description ordre:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Route to get a specific description of a product
router.get('/specific-description/:productId/:descriptionId', async (req, res) => {
    const { productId, descriptionId } = req.params;

    try {
        const description = await Description.findById(descriptionId);
        if (!description) {
            return res.status(404).json({ message: 'Description not found' });
        }
        res.status(200).json(description);
    } catch (error) {
        console.error('Error retrieving specific description:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


// Route to update a specific description of a product
router.put('/update-description/:productId/:descriptionId', async (req, res) => {
    const { productId, descriptionId } = req.params;
    const { title, family, description } = req.body;

    try {
        // Find the specific description by its ID
        const descriptionToUpdate = await Description.findById(descriptionId);
        if (!descriptionToUpdate) {
            return res.status(404).json({ message: 'Description not found' });
        }

        // Update the description fields
        descriptionToUpdate.title = title || descriptionToUpdate.title;
        descriptionToUpdate.family = family || descriptionToUpdate.family;
        descriptionToUpdate.description = description || descriptionToUpdate.description;

        // Save the updated description
        await descriptionToUpdate.save();

        res.status(200).json({ message: 'Description updated successfully', description: descriptionToUpdate });
    } catch (error) {
        console.error('Error updating description:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});



router.get('/pagination', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    try {
        const products = await Product.find()
            .populate('productLocation') // Populates the productLocation field with the actual location document
            .populate('productType') // Populates the productType field
            .populate('productSubType') // Populates the productSubType field
            .populate('productStatus') // Populates the productStatus field if it's a referenced object
            .skip(parseInt(skip, 10)) 
            .limit(parseInt(limit, 10));
        
        const totalProducts = await Product.countDocuments();

        res.json({
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
router.get('/search', async (req, res) => {
    const { id, productName, productType, productLocation, productStatus, productSubType, fournisseur, page = 1, limit = 10 } = req.query;

    try {
        const query = {};

        // Use regex for flexible searching on id and productName
        if (id) {
            query.id = new RegExp(id, 'i'); 
        }
        if (productName) {
            query.productName = new RegExp(productName, 'i');
        }

        // Exact match for ObjectID references
        if (productType) {
            const type = await ProductType.findOne({ name: productType });
            if (type) query.productType = type._id;
        }
        if (productLocation) {
            const location = await ProductLocation.findOne({ name: productLocation });
            if (location) query.productLocation = location._id;
        }
        if (productStatus) {
            const status = await ProductStatus.findOne({ name: productStatus });
            if (status) query.productStatus = status._id;
        }
        if (productSubType) {
            const subType = await ProductSubType.findOne({ name: productSubType });
            if (subType) query.productSubType = subType._id;
        }
        if (fournisseur) {
            const supplier = await Fournisseur.findOne({ name: fournisseur });
            if (supplier) query.fournisseur = supplier._id;
        }

        // Calculate skip and limit for pagination
        const skip = (page - 1) * limit;

        // Execute the query with populated fields and pagination
        const products = await Product.find(query)
            .populate('productType')
            .populate('productLocation')
            .populate('productStatus')
            .populate('productSubType')
            .populate('fournisseur')
            .sort({ creationDate: -1 }) // Sort by creation date in descending order
            .skip(parseInt(skip, 10)) // Ensure skip is an integer
            .limit(parseInt(limit, 10)); // Ensure limit is an integer

        // Get the total number of documents that match the query (for pagination)
        const totalProducts = await Product.countDocuments(query);

        // Send response with products and pagination details
        res.json({
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: parseInt(page, 10)
        });
    } catch (error) {
        console.error('Error fetching products:', error); // Log the error to understand it better
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});


module.exports = router;

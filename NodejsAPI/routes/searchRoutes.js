const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ProductType, ProductLocation, ProductStatus, ProductSubType, Fournisseur,Product, Description } = require('../models/Product'); // Adjust the path to your models

// Combined Search Route
router.get('/', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        

        // Count and Search in Product Collection
        const productCountPromise = mongoose.connection.db.collection('products').aggregate([
            {
                $search: {
                    index: 'PRODUCT_INDEX', // Use your Atlas Search index for Product collection
                    compound: {
                        should: [
                            {
                                autocomplete: {
                                    query: query,
                                    path: 'productName',
                                    fuzzy: { maxEdits: 1 },
                                },
                            },
                            {
                                autocomplete: {
                                    query: query,
                                    path: 'id',
                                    fuzzy: { maxEdits: 1 },
                                },
                            }
                        ],
                    },
                },
            },
            {
                $count: 'totalResults', // Count total matching products
            },
        ]).toArray();

        const productResultsPromise = mongoose.connection.db.collection('products').aggregate([
            {
                $search: {
                    index: 'PRODUCT_INDEX', // Use your Atlas Search index for Product collection
                    compound: {
                        should: [
                            {
                                autocomplete: {
                                    query: query,
                                    path: 'productName',
                                    fuzzy: { maxEdits: 1 },
                                },
                            },
                            {
                                autocomplete: {
                                    query: query,
                                    path: 'id',
                                    fuzzy: { maxEdits: 1 },
                                },
                            }
                        ],
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    productName: 1,
                    id: 1,
                    descriptions: 1,
                    score: { $meta: 'searchScore' },
                },
            },
        ]).toArray();

        // Count and Search in Description Collection
        const descriptionCountPromise = mongoose.connection.db.collection('descriptions').aggregate([
            {
                $search: {
                    index: 'DESCRIPTION_INDEX', // Use your Atlas Search index for Description collection
                    compound: {
                        should: [
                            {
                                autocomplete: {
                                    query: query,
                                    path: 'title',
                                    fuzzy: { maxEdits: 1 },
                                },
                            },
                            {
                                autocomplete: {
                                    query: query,
                                    path: 'description',
                                    fuzzy: { maxEdits: 1 },
                                },
                            }
                        ],
                    },
                },
            },
            {
                $count: 'totalResults', // Count total matching descriptions
            },
        ]).toArray();

        const descriptionResultsPromise = mongoose.connection.db.collection('descriptions').aggregate([
            {
                $search: {
                    index: 'DESCRIPTION_INDEX', // Use your Atlas Search index for Description collection
                    compound: {
                        should: [
                            {
                                autocomplete: {
                                    query: query,
                                    path: 'title',
                                    fuzzy: { maxEdits: 1 },
                                },
                            },
                            {
                                autocomplete: {
                                    query: query,
                                    path: 'description',
                                    fuzzy: { maxEdits: 1 },
                                },
                            }
                        ],
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    score: { $meta: 'searchScore' },
                },
            },
        ]).toArray();

        // Wait for all promises to resolve
        const [productCountResults, productResults, descriptionCountResults, descriptionResults] = await Promise.all([
            productCountPromise,
            productResultsPromise,
            descriptionCountPromise,
            descriptionResultsPromise
        ]);

        // Extract counts
        const productCount = productCountResults.length > 0 ? productCountResults[0].totalResults : 0;
        const descriptionCount = descriptionCountResults.length > 0 ? descriptionCountResults[0].totalResults : 0;

        // Combine Results
        const combinedResults = {
            products: {
                results: productResults,
                totalCount: productCount,
            },
            descriptions: {
                results: descriptionResults,
                totalCount: descriptionCount,
            },
        };

        res.json(combinedResults);
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ message: 'Search failed', error: error.message });
    }
});



router.get('/search-products', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }



        // Search in Product Collection
        const [productSearchResults, productTotalCount] = await Promise.all([
            mongoose.connection.db.collection('products').aggregate([
                {
                    $search: {
                        index: 'PRODUCT_INDEX', // Use your Atlas Search index for Product collection
                        compound: {
                            should: [
                                {
                                    autocomplete: {
                                        query: query,
                                        path: 'productName',
                                        fuzzy: { maxEdits: 1 },
                                    },
                                },
                                {
                                    autocomplete: {
                                        query: query,
                                        path: 'id',
                                        fuzzy: { maxEdits: 1 },
                                    },
                                }
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        productName: 1,
                        id: 1,
                        descriptions: 1,
                        score: { $meta: 'searchScore' },
                    },
                },
                {
                    $limit: 10,
                },
            ]).toArray(),

            mongoose.connection.db.collection('products').aggregate([
                {
                    $search: {
                        index: 'PRODUCT_INDEX', // Use your Atlas Search index for Product collection
                        compound: {
                            should: [
                                {
                                    autocomplete: {
                                        query: query,
                                        path: 'productName',
                                        fuzzy: { maxEdits: 1 },
                                    },
                                },
                                {
                                    autocomplete: {
                                        query: query,
                                        path: 'id',
                                        fuzzy: { maxEdits: 1 },
                                    },
                                }
                            ],
                        },
                    },
                },
                {
                    $count: 'totalCount'
                }
            ]).toArray()
        ]);


        res.json({
            products: productSearchResults,
            totalCount: productTotalCount[0] ? productTotalCount[0].totalCount : 0
        });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ message: 'Search failed', error: error.message });
    }
});



// Search Descriptions by Title and Description Text
router.get('/search-descriptions-title-text', async (req, res) => {
    try {
        const { titleQuery, descriptionQuery } = req.query;

        if (!titleQuery && !descriptionQuery) {
            return res.status(400).json({ message: 'At least one search query (titleQuery or descriptionQuery) is required' });
        }

       

        // Construct the search criteria based on provided queries
        const searchCriteria = {
            $search: {
                index: 'DESCRIPTION_INDEX', // Use your Atlas Search index for Description collection
                compound: {
                    should: [
                        titleQuery ? {
                            autocomplete: {
                                query: titleQuery,
                                path: 'title',
                                fuzzy: { maxEdits: 1 },
                            },
                        } : null,
                        descriptionQuery ? {
                            autocomplete: {
                                query: descriptionQuery,
                                path: 'description',
                                fuzzy: { maxEdits: 1 },
                            },
                        } : null
                    ].filter(Boolean), // Remove null values from the array
                },
            },
        };

        // Search in Description Collection
        const [descriptionSearchResults, descriptionTotalCount] = await Promise.all([
            mongoose.connection.db.collection('descriptions').aggregate([
                searchCriteria,
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        description: 1,
                        score: { $meta: 'searchScore' },
                    },
                },
                {
                    $limit: 50,
                },
            ]).toArray(),

            mongoose.connection.db.collection('descriptions').aggregate([
                searchCriteria,
                {
                    $count: 'totalCount'
                }
            ]).toArray()
        ]);

      

        res.json({
            descriptions: descriptionSearchResults,
            totalCount: descriptionTotalCount[0] ? descriptionTotalCount[0].totalCount : 0
        });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ message: 'Search failed', error: error.message });
    }
});


router.post('/update-descriptions-fromsearch', async (req, res) => {
    const { ids, criteria, nameToBeReplaced, newName } = req.body;

    if (!ids || !Array.isArray(ids) || !nameToBeReplaced || !newName || !criteria) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    if (!['title', 'description', 'both'].includes(criteria)) {
        return res.status(400).json({ error: 'Invalid criteria' });
    }

    try {
        // Convert IDs to ObjectId
        const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));

        const regex = new RegExp(nameToBeReplaced, 'gi'); // 'gi' for global and case-insensitive

        // Update documents individually
        for (const id of objectIds) {
            const doc = await Description.findById(id);

            if (doc) {
                let updated = false;
                if (criteria === 'title' || criteria === 'both') {
                    if (regex.test(doc.title)) {
                        doc.title = doc.title.replace(regex, newName);
                        updated = true;
                    }
                }
                if (criteria === 'description' || criteria === 'both') {
                    if (regex.test(doc.description)) {
                        doc.description = doc.description.replace(regex, newName);
                        updated = true;
                    }
                }

                if (updated) {
                    await doc.save();
                   
                }
            }
        }

        res.status(200).json({ message: 'Descriptions updated successfully' });
    } catch (error) {
        console.error('Error updating descriptions:', error);
        res.status(500).json({ error: 'Failed to update descriptions' });
    }
});

// In your Express router file (e.g., `routes/products.js`)

router.post('/update-products-fromsearch', async (req, res) => {
    const { ids, nameToBeReplaced, newName } = req.body;

    if (!ids || !Array.isArray(ids) || !nameToBeReplaced || !newName) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        // Convert IDs to ObjectId
        const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));

        const regex = new RegExp(nameToBeReplaced, 'gi'); // 'gi' for global and case-insensitive

        // Update products individually
        for (const id of objectIds) {
            const product = await Product.findById(id);

            if (product) {
                if (regex.test(product.productName)) {
                    product.productName = product.productName.replace(regex, newName);
                    await product.save();
                }
            }
        }

        res.status(200).json({ message: 'Products updated successfully' });
    } catch (error) {
        console.error('Error updating products:', error);
        res.status(500).json({ error: 'Failed to update products' });
    }
});

// ---------------------------------------------------------------------------------------------with products 
// ---------------------------------------------------------------------------------------------with products 
// ---------------------------------------------------------------------------------------------with products 
// ---------------------------------------------------------------------------------------------with products 
// ---------------------------------------------------------------------------------------------with products 
// ---------------------------------------------------------------------------------------------with products 
// ---------------------------------------------------------------------------------------------with products 
// ---------------------------------------------------------------------------------------------with products 
// ---------------------------------------------------------------------------------------------with products 
// ---------------------------------------------------------------------------------------------with products 
async function findProductFieldIds({
    productTypeName,
    productLocationNames,
    productName,
    productStatusName,
    productSubTypeName,
    fournisseurName
}) {
    const results = {};

    if (productTypeName) {
        const productType = await ProductType.findOne({ name: productTypeName });
        results.productTypeId = productType ? productType._id : null;
    }

    if (productLocationNames && productLocationNames.length > 0) {
        const productLocations = await ProductLocation.find({ name: { $in: productLocationNames } });
        results.productLocationIds = productLocations.map(loc => loc._id);
    }

    if (productName) {
        const product = await Product.findOne({ productName });
        results.productId = product ? product._id : null;
    }

    if (productStatusName) {
        const productStatus = await ProductStatus.findOne({ name: productStatusName });
        results.productStatusId = productStatus ? productStatus._id : null;
    }

    if (productSubTypeName) {
        const productSubType = await ProductSubType.findOne({ name: productSubTypeName });
        results.productSubTypeId = productSubType ? productSubType._id : null;
    }

    if (fournisseurName) {
        const fournisseur = await Fournisseur.findOne({ name: fournisseurName });
        results.fournisseurId = fournisseur ? fournisseur._id : null;
    }

    return results;
}
router.get('/search-descriptions-title-text-with-products', async (req, res) => {
    try {
        const {
            titleQuery,
            descriptionQuery,
            productLocation,
            productName,
            productStatus,
            productSubType,
            productType,
            fournisseur,
            id,
        } = req.query;
        const start = Date.now();
        if (!titleQuery && !descriptionQuery) {
            return res.status(400).json({ message: 'At least one search query (titleQuery or descriptionQuery) is required' });
        }

        // Find product field IDs
        const ids = await findProductFieldIds({
            productTypeName: productType,
            productLocationNames: productLocation ? productLocation.split(',') : [],
            productName,
            productStatusName: productStatus,
            productSubTypeName: productSubType,
            fournisseurName: fournisseur
        });

        // Construct the search criteria based on provided queries
        const searchCriteria = {
            $match: {
                ...(titleQuery ? { title: { $regex: new RegExp(titleQuery, 'i') } } : {}),
                ...(descriptionQuery ? { description: { $regex: new RegExp(descriptionQuery, 'i') } } : {}),
            }
        };

        // Count all matching descriptions
        const [descriptionTotalCount] = await Promise.all([
            mongoose.connection.db.collection('descriptions').aggregate([
                searchCriteria,
                {
                    $count: 'totalCount'
                }
            ]).toArray()
        ]);

        // Search in Description Collection
        const descriptions = await mongoose.connection.db.collection('descriptions').aggregate([
            searchCriteria,
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    score: { $meta: 'searchScore' },
                },
            },
            {
                $lookup: {
                    from: 'products', 
                    localField: '_id',
                    foreignField: 'descriptions', 
                    as: 'productDetails',
                },
            },
            {
                $unwind: '$productDetails',
            },
            {
                $limit: 400, 
            }
        ]).toArray();

        // Filter descriptions based on the product criteria
        const filteredResults = descriptions.filter(desc => {
            const product = desc.productDetails;
            return (
                (!id || product.id.toLowerCase().includes(id.toLowerCase())) &&
                (!ids.productTypeId || product.productType.equals(ids.productTypeId)) &&
                (!ids.productLocationIds || product.productLocation.includes(ids.productLocationIds)) &&
                (!productName || product.productName.toLowerCase().includes(productName.toLowerCase())) &&
                (!ids.productStatusId || product.productStatus.equals(ids.productStatusId)) &&
                (!ids.productSubTypeId || product.productSubType.equals(ids.productSubTypeId)) &&
                (!ids.fournisseurId || product.fournisseur.equals(ids.fournisseurId))
            );
        });
        const limitedResults = filteredResults.slice(0, 50);
        
        // Formatting the response
        const formattedResults = limitedResults.map(desc => ({
            _id: desc._id,
            title: desc.title,
            description: desc.description,
            productDetails: {
                product_id: desc.productDetails._id,
                productid: desc.productDetails.id,
                productName: desc.productDetails.productName,
                productsubtype: desc.productDetails.productSubType,
                producttype: desc.productDetails.productType
                // Add more fields as necessary
            }
        }));
        const end = Date.now(); // End measuring time
        const executionTime = end - start; // Calculate execution time
        res.json({
            descriptions: formattedResults,
            totalCount: descriptionTotalCount[0] ? descriptionTotalCount[0].totalCount : 0,
            executionTime: executionTime
        });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ message: 'Search failed', error: error.message });
    }
});

router.get('/search-descriptions-title-text-with-productsFUZZY', async (req, res) => {
    try {
        const {
            titleQuery,
            descriptionQuery,
            productLocation,
            productName,
            productStatus,
            productSubType,
            productType,
            fournisseur,
            id,
        } = req.query;
        const start = Date.now();
        if (!titleQuery && !descriptionQuery) {
            return res.status(400).json({ message: 'At least one search query (titleQuery or descriptionQuery) is required' });
        }

        // Find product field IDs
        const ids = await findProductFieldIds({
            productTypeName: productType,
            productLocationNames: productLocation ? productLocation.split(',') : [],
            productName,
            productStatusName: productStatus,
            productSubTypeName: productSubType,
            fournisseurName: fournisseur
        });

        // Construct the search criteria based on provided queries
        const searchCriteria = {
            $search: {
                index: 'DESCRIPTION_INDEX', // Use your Atlas Search index for Description collection
                compound: {
                    should: [
                        titleQuery ? {
                            autocomplete: {
                                query: titleQuery,
                                path: 'title',
                                fuzzy: { maxEdits: 1 },
                                tokenOrder: "sequential",
                            },
                        } : null,
                        descriptionQuery ? {
                            autocomplete: {
                                query: descriptionQuery,
                                path: 'description',
                                fuzzy: { maxEdits: 1 },
                                tokenOrder: "sequential",
                            },
                        } : null
                    ].filter(Boolean), // Remove null values from the array
                },
            },
        };

        // Count all matching descriptions
        const [descriptionTotalCount] = await Promise.all([
            mongoose.connection.db.collection('descriptions').aggregate([
                searchCriteria,
                {
                    $count: 'totalCount'
                }
            ]).toArray()
        ]);

        // Search in Description Collection
        const descriptions = await mongoose.connection.db.collection('descriptions').aggregate([
            searchCriteria,
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    score: { $meta: 'searchScore' },
                },
            },
            
            {
                $lookup: {
                    from: 'products', 
                    localField: '_id',
                    foreignField: 'descriptions', 
                    as: 'productDetails',
                },
            },
            {
                $unwind: '$productDetails',
            },
            {
                $limit: 400, 
            }
        ]).toArray();

        // Filter descriptions based on the product criteria
        const filteredResults = descriptions.filter(desc => {
            const product = desc.productDetails;
            return (
                (!id || product.id.toLowerCase().includes(id.toLowerCase()))&&
                (!ids.productTypeId || product.productType.equals(ids.productTypeId)) &&
                (!ids.productLocationIds || product.productLocation.includes(ids.productLocationIds)) &&
                (!productName || product.productName.toLowerCase().includes(productName.toLowerCase())) &&
                (!ids.productStatusId || product.productStatus.equals(ids.productStatusId)) &&
                (!ids.productSubTypeId || product.productSubType.equals(ids.productSubTypeId)) &&
                (!ids.fournisseurId || product.fournisseur.equals(ids.fournisseurId))
            );
        });
        const limitedResults = filteredResults.slice(0, 50);
        // Formatting the response
        const formattedResults = limitedResults.map(desc => ({
            _id: desc._id,
            title: desc.title,
            description: desc.description,
            productDetails: {
                product_id: desc.productDetails._id,
                productid: desc.productDetails.id,
                productName: desc.productDetails.productName,
                productsubtype: desc.productDetails.productSubType,
                producttype: desc.productDetails.productType
                // Add more fields as necessary
            }
        }));
        const end = Date.now(); // End measuring time
        const executionTime = end - start; // Calculate execution time
        res.json({
            descriptions: formattedResults,
            totalCount: descriptionTotalCount[0] ? descriptionTotalCount[0].totalCount : 0,
            executionTime : executionTime
        });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ message: 'Search failed', error: error.message });
    }
});

router.get('/search-products-filtered', async (req, res) => {
    try {
        const {
            id,
            productName,
            productTypeName,
            productLocationNames,
            productStatusName,
            productSubTypeName,
            fournisseurName
        } = req.query;
        const start = Date.now();
        // Convert query parameters to arrays if they are not already
        const productLocationNamesArray = Array.isArray(productLocationNames) ? productLocationNames : [productLocationNames];

        if (!id && !productName) {
            return res.status(400).json({ message: 'At least one search parameter (id or productName) is required' });
        }

        // Find product field IDs based on names
        const ids = await findProductFieldIds({
            productTypeName,
            productLocationNames: productLocationNamesArray,
            productStatusName,
            productSubTypeName,
            fournisseurName
        });

        // Build search pipeline
        const searchPipeline = [
            {
                $search: {
                    index: 'PRODUCT_INDEX',
                    compound: {
                        should: [
                            id ? {
                                autocomplete: {
                                    query: id,
                                    path: 'id',
                                    fuzzy: { maxEdits: 1 },
                                    tokenOrder: "sequential",
                                },
                            } : null,
                            productName ? {
                                autocomplete: {
                                    query: productName,
                                    path: 'productName',
                                    fuzzy: { maxEdits: 1 },
                                    tokenOrder: "sequential",
                                },
                            } : null
                        ].filter(Boolean),
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    productName: 1,
                    id: 1,
                    descriptions: 1,
                    productType: 1,
                    productLocation: 1,
                    productStatus: 1,
                    productSubType: 1,
                    fournisseur: 1,
                    score: { $meta: 'searchScore' },
                },
            },
         
        ];

        // Execute search query
        const [productSearchResults, productTotalCount] = await Promise.all([
            mongoose.connection.db.collection('products').aggregate(searchPipeline).toArray(),
            mongoose.connection.db.collection('products').aggregate([
                {
                    $search: {
                        index: 'PRODUCT_INDEX',
                        compound: {
                            should: [
                                id ? {
                                    autocomplete: {
                                        query: id,
                                        path: 'id',
                                        fuzzy: { maxEdits: 1 },
                                    },
                                } : null,
                                productName ? {
                                    autocomplete: {
                                        query: productName,
                                        path: 'productName',
                                        fuzzy: { maxEdits: 1 },
                                    },
                                } : null
                            ].filter(Boolean),
                        },
                    },
                },
                {
                    $count: 'totalCount'
                }
            ]).toArray()
        ]);

        // Filter results based on additional product details
        const filteredResults = productSearchResults.filter(product => {
            let valid = true;

            // Apply filters only if corresponding IDs are provided
            if (ids.productTypeId) {
                if (!product.productType.equals(ids.productTypeId)) valid = false;
            }
            if (ids.productLocationIds.length > 0) {
                if (!product.productLocation.some(loc => ids.productLocationIds.includes(loc))) valid = false;
            }
            if (ids.productStatusId) {
                if (!product.productStatus.equals(ids.productStatusId)) valid = false;
            }
            if (ids.productSubTypeId) {
                if (!product.productSubType.equals(ids.productSubTypeId)) valid = false;
            }
            if (ids.fournisseurId) {
                if (!product.fournisseur.equals(ids.fournisseurId)) valid = false;
            }

            return valid;
        });
        const end = Date.now(); // End measuring time
        const executionTime = end - start; // Calculate execution time
        const limitedResults = filteredResults.slice(0, 100);
        res.json({
            products: limitedResults,
            totalCount: productTotalCount[0] ? productTotalCount[0].totalCount : 0,
            executionTime :  executionTime 
        });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ message: 'Search failed', error: error.message });
    }
});

module.exports = router;








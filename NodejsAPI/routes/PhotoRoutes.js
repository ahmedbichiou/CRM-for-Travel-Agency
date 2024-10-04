const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { Product } = require('../models/Product'); // Ensure the path is correct
const { Url } = require('../models/Product'); 
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for GridFS

// GET a GridFSBucket from app.locals
const getBucket = (req) => req.app.locals.bucket;

// POST route to upload photos
router.post('/upload/:productId', upload.array('photos', 10), async (req, res) => {
    const { productId } = req.params;
    const files = req.files;

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        const bucket = getBucket(req);

        // Fetch all existing images related to the product
        const existingPhotos = await bucket.find({ "metadata.product": productId }).toArray();
        
        // Determine the current max ordre value
     
        const existingUrls = await Url.find({ productId });

        // Determine the current max ordre value
    



        // Fetch all existing images related to the product
    
        // Save each uploaded file to GridFS with incremented ordre
        const photoPromises = files.map((file, index) => {
            const ordre = existingUrls.length+existingPhotos.length+ index + 1; // Incrementing ordre for each new file
            return new Promise((resolve, reject) => {
                const uploadStream = bucket.openUploadStream(file.originalname, {
                    metadata: { product: productId, ordre, photoType:'List' },
                    contentType: file.mimetype
                });
                uploadStream.on('error', reject);
                uploadStream.on('finish', () => resolve(uploadStream.id));
                uploadStream.end(file.buffer);
            });
        });

        const fileIds = await Promise.all(photoPromises);
        res.status(200).json({ fileIds });
    } catch (error) {
        console.error('Error uploading files:', error);
        res.status(500).send('Internal server error');
    }
});


// Route to retrieve a file by filename
router.get('/getByName/:filename', (req, res) => {
    const { filename } = req.params;
    const bucket = getBucket(req);

    bucket.openDownloadStreamByName(filename)
        .on('error', (err) => {
            res.status(404).send('File not found');
        })
        .pipe(res);
});




// Route to fetch all photos for a specific product
router.get('/GetByproductid/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        const bucket = getBucket(req);

        // Find all files with metadata matching the productId
        const files = await bucket.find({ 'metadata.product': productId }).toArray();
        
        // If no photos are found, return an empty array
        if (files.length === 0) {
            return res.status(200).json({ photos: [] });
        }

        // Collect file details along with the base64 encoded data
        const photoPromises = files.map(file => {
            return new Promise((resolve, reject) => {
                const downloadStream = bucket.openDownloadStream(file._id);
                let data = [];

                downloadStream.on('data', (chunk) => {
                    data.push(chunk);
                });

                downloadStream.on('end', () => {
                    const base64 = Buffer.concat(data).toString('base64');
                    resolve({
                        _id: file._id,
                        filename: file.filename,
                        ordre: file.metadata.ordre,
                        contentType: file.contentType,
                        uploadDate: file.uploadDate,
                       photoType: file.metadata.photoType,
                        base64: `data:${file.contentType};base64,${base64}`
                    });
                });

                downloadStream.on('error', (err) => {
                    reject(err);
                });
            });
        });

        const photos = await Promise.all(photoPromises);
        res.status(200).json({ photos });
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).send('Internal server error');
    }
});

// Route to fetch all photos for a specific product
router.get('/GetPhotoIdsByProductId/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        const bucket = getBucket(req);

        // Find all files with metadata matching the productId
        const files = await bucket.find({ 'metadata.product': productId }).toArray();
        
        // If no photos are found, return an empty array
        if (files.length === 0) {
            return res.status(200).json({ photos: [] });
        }

        // Collect file details along with the base64 encoded data
        const photoPromises = files.map(file => {
            return new Promise((resolve, reject) => {
                const downloadStream = bucket.openDownloadStream(file._id);
                let data = [];

                downloadStream.on('data', (chunk) => {
                    data.push(chunk);
                });

                downloadStream.on('end', () => {
                 
                    resolve({
                        _id: file._id,
                       
                    });
                });

                downloadStream.on('error', (err) => {
                    reject(err);
                });
            });
        });

        const photos = await Promise.all(photoPromises);
        res.status(200).json({ photos });
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).send('Internal server error');
    }
});



router.delete('/delete/:fileId', async (req, res) => {
    const { fileId } = req.params;

    try {
        const bucket = getBucket(req);

        // Check if the file exists
        const file = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
        if (file.length === 0) {
            return res.status(404).send('File not found');
        }

        // Delete the file
        await bucket.delete(new mongoose.Types.ObjectId(fileId));

        // Fetch all remaining photos for the product
        const remainingPhotos = await bucket.find({ 'metadata.product': file[0].metadata.product }).toArray();

        // Sort photos by their current order
        const sortedPhotos = remainingPhotos.sort((a, b) => a.metadata.ordre - b.metadata.ordre);

        // Update the order for remaining photos
        const updatePromises = sortedPhotos.map((photo, index) => {
            return bucket.s.db.collection(bucket.s._filesCollection.collectionName).updateOne(
                { _id: photo._id },
                { $set: { 'metadata.ordre': index + 1 } } // Set new ordre
            );
        });

        await Promise.all(updatePromises);

        res.status(200).send('File deleted and orders updated successfully');
    } catch (error) {
        console.error('Error deleting file and updating orders:', error);
        res.status(500).send('Internal server error');
    }
});


// Route to update the ordre of a specific photo by fileId
router.patch('/updateOrdre/:fileId', async (req, res) => {
    const { fileId } = req.params;
    const { ordre } = req.body; // Expecting the new ordre in the request body

    // Validate ordre (ensure it is a number and greater than 0)
    if (!Number.isInteger(ordre) || ordre <= 0) {
        return res.status(400).send('Invalid ordre value');
    }

    try {
        const bucket = getBucket(req);

        // Check if the file exists
        const file = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
        if (file.length === 0) {
            return res.status(404).send('File not found');
        }

        const fileMetadata = file[0].metadata || {};

        // Update the ordre in the metadata
        fileMetadata.ordre = ordre;

        // Update the metadata directly in the GridFS files collection
        await bucket.s.db.collection(bucket.s._filesCollection.collectionName).updateOne(
            { _id: new mongoose.Types.ObjectId(fileId) },
            { $set: { 'metadata.ordre': ordre } }
        );

        res.status(200).send('Ordre updated successfully');
    } catch (error) {
        console.error('Error updating ordre:', error);
        res.status(500).send('Internal server error');
    }
});


// Route to update the photoType of a specific photo by fileId
router.patch('/updatePhotoType/:fileId', async (req, res) => {
    const { fileId } = req.params;
    const { photoType } = req.body; // Expecting the new photoType in the request body

    // Validate photoType
    if (!['List', 'Gallery', 'Panoramic', 'Icon'].includes(photoType)) {
        return res.status(400).send('Invalid photoType');
    }

    try {
        const bucket = getBucket(req);

        // Check if the file exists
        const file = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
        if (file.length === 0) {
            return res.status(404).send('File not found');
        }

        const fileMetadata = file[0].metadata || {};

        // Update the photoType in the metadata
        fileMetadata.photoType = photoType;

        // Update the metadata directly in the GridFS files collection
        await bucket.s.db.collection(bucket.s._filesCollection.collectionName).updateOne(
            { _id: new mongoose.Types.ObjectId(fileId) },
            { $set: { metadata: fileMetadata } }
        );

        res.status(200).send('PhotoType updated successfully');
    } catch (error) {
        console.error('Error updating photoType:', error);
        res.status(500).send('Internal server error');
    }
});

router.post('/uploadUrls/:productId', async (req, res) => {
    const { productId } = req.params;
    const { urls } = req.body; // Expecting urls as an array

    try {
        // Validate URLs array
        if (!Array.isArray(urls)) {
            return res.status(400).json({ message: 'Invalid URLs format' });
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Fetch all existing URLs related to the product
        const existingUrls = await Url.find({ productId });

        // Determine the current max ordre value
    

        const bucket = getBucket(req);

        // Fetch all existing images related to the product
        const existingPhotos = await bucket.find({ "metadata.product": productId }).toArray();
        
        // Determine the current max ordre value
       
        const urlPromises = urls.map((url, index) => {
            const ordre = existingPhotos.length  +existingUrls.length + index + 1; // Incrementing ordre for each new URL
            const newUrl = new Url({
                productId,
                url,
                ordre
            });
            return newUrl.save();
        });

        const savedUrls = await Promise.all(urlPromises);
        res.status(200).json({ savedUrls });
    } catch (error) {
        console.error('Error saving URLs:', error);
        res.status(500).json({ message: 'Error saving URLs', error: error.message });
    }
});

// PUT route to update URL type
router.put('/updatePhotoURLType/:urlId', async (req, res) => {
    const { urlId } = req.params;
    const { type } = req.body; // Expecting type as a string

    try {
        // Validate type
        if (typeof type !== 'string') {
            return res.status(400).json({ message: 'Invalid type format' });
        }

        // Update URL type
        const updatedUrl = await Url.findByIdAndUpdate(
            urlId,
            { $set: { type } },
            { new: true } // Return the updated document
        );

        if (!updatedUrl) {
            return res.status(404).json({ message: 'URL not found' });
        }

        res.status(200).json({ updatedUrl });
    } catch (error) {
        console.error('Error updating URL type:', error);
        res.status(500).json({ message: 'Error updating URL type', error: error.message });
    }
});
router.put('/updateURLOrdre/:urlId', async (req, res) => {
    const { urlId } = req.params;
    const { ordre } = req.body; // Expecting ordre as a number

    try {
        // Validate ordre
        if (typeof ordre !== 'number' || ordre <= 0) {
            return res.status(400).json({ message: 'Invalid ordre format' });
        }

        // Update URL ordre
        const updatedUrl = await Url.findByIdAndUpdate(
            urlId,
            { $set: { ordre } },
            { new: true } // Return the updated document
        );

        if (!updatedUrl) {
            return res.status(404).json({ message: 'URL not found' });
        }

        res.status(200).json({ updatedUrl });
    } catch (error) {
        console.error('Error updating URL ordre:', error);
        res.status(500).json({ message: 'Error updating URL ordre', error: error.message });
    }
});
router.get('/getUrls/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        // Fetch all URLs related to the product
        const urls = await Url.find({ productId });

        // Return an empty array if no URLs are found
        if (!urls || urls.length === 0) {
            return res.status(200).json([]);
        }

        // Map URLs to include url, ordre, and type
        const result = urls.map(({ _id, url, ordre, type }) => ({ _id, url, ordre, type }));

        res.status(200).json(result);
    } catch (error) {
        console.error('Error retrieving URLs:', error);
        res.status(500).json({ message: 'Error retrieving URLs', error: error.message });
    }
});

router.delete('/deleteUrl/:urlId', async (req, res) => {
    const { urlId } = req.params;

    try {
        // Delete the URL by ID
        const result = await Url.findByIdAndDelete(urlId);

        if (!result) {
            return res.status(404).json({ message: 'URL not found' });
        }

        res.status(200).json({ message: 'URL deleted successfully' });
    } catch (error) {
        console.error('Error deleting URL:', error);
        res.status(500).json({ message: 'Error deleting URL', error: error.message });
    }
});
module.exports = router;

const express = require('express');

// Generic CRUD function
function createCrudRoutes(Model, routeName) {
    const router = express.Router();

    // GET all records
    router.get('/', async (req, res) => {
        try {
            const records = await Model.find();
            res.json(records);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // GET a single record by ID
    router.get('/:id', async (req, res) => {
        try {
            const record = await Model.findById(req.params.id);
            if (!record) return res.status(404).json({ message: `${routeName} not found` });
            res.json(record);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    // POST a new record
    router.post('/', async (req, res) => {
        const newRecord = new Model(req.body);

        try {
            const savedRecord = await newRecord.save();
            res.status(201).json(savedRecord);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

    // PUT update a record by ID
    router.put('/:id', async (req, res) => {
        try {
            const updatedRecord = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedRecord) return res.status(404).json({ message: `${routeName} not found` });
            res.json(updatedRecord);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
    router.get('/get-byName/:name', async (req, res) => {
        const { name } = req.params;
    
        try {
            const location = await  Model.findOne({ name: name }).exec();
            if (!location) {
                return res.status(404).json({ message: 'Location not found' });
            }
            res.json(location);
        } catch (error) {
            console.error('Error fetching location:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    // DELETE a record by ID
    router.delete('/:id', async (req, res) => {
        try {
            const deletedRecord = await Model.findByIdAndDelete(req.params.id);
            if (!deletedRecord) return res.status(404).json({ message: `${routeName} not found` });
            res.json({ message: `${routeName} deleted` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

    return router;


  
}





module.exports = createCrudRoutes;

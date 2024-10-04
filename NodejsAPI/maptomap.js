const mongoose = require('mongoose');
const fs = require('fs');
const { Product, ProductType, ProductLocation, ProductSubType, ProductStatus, Pension, Fournisseur, Description } = require('./models/Product');
const crypto = require('crypto');
const multer = require('multer');
const { Url } = require('./models/Product'); 
const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

async function createPhotoUrls(productId, urls) {
    const urlPromises = urls.map(async (url, index) => {
        try {
            const newPhotoUrl = new Url({
                productId,
                url,
                ordre: index + 1
            });
            await newPhotoUrl.save();
        } catch (error) {
            console.error('Error creating photo URL:', error);
        }
    });

    await Promise.all(urlPromises);
}
function replaceHtmlEntities(text) {
    return text
        .replace(/&xe9;/g, 'é') 
        .replace(/&39;/g, "'")   
        .replace(/&34;/g, '"')   
        .replace(/&xe0;/g, 'à') 
        .replace(/&xe8;/g, 'è') 
        .replace(/&xe7;/g, 'ç')  
        .replace(/&xf4;/g, 'ô');
}


function generateChecksum(content) {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(content));
    return hash.digest('hex');
}


function replaceUnderscoresWithSpaces(text) {
    return text.replace(/_/g, ' ');
}


async function createDescriptions(paragraphs) {
    if (!paragraphs || !Array.isArray(paragraphs)) {
        console.error('Invalid description data.');
        return [];
    }

    const descriptionIds = await Promise.all(paragraphs.map(async (desc, index) => {
        try {
            const newDescription = new Description({
                title: replaceHtmlEntities(desc.titre) || `Title ${index + 1}`, 
                family: "Description", 
                description: replaceHtmlEntities(desc.texte) || `Description ${index + 1}`, 
                ordre: index + 1 
            });
            await newDescription.save();
            return newDescription._id; 
        } catch (error) {
            console.error('Error creating description:', error);
        }
    }));

    return descriptionIds.filter(id => id); 
}

async function transformAndInsertData(data) {
    for (let produit of data.fournisseur.catalogue.produits.produit) {
        let SAMEchecksum = false;
        
        try {
           
            const initialChecksum = generateChecksum(produit);
           
            const productId = produit.informations_generiques.references.interne_to.libelle;
            
          
            let existingProduct = await Product.findOne({ id: productId });
            if (existingProduct) {
               
                if (existingProduct.checksum && existingProduct.checksum === initialChecksum) {
                    console.log(`Product with id ${productId} is up-to-date. Skipping.`);
                    SAMEchecksum = true; 
                    continue; 
                } else {
                    SAMEchecksum = false; 
                
                    
                    if (existingProduct.descriptions && existingProduct.descriptions.length > 0) {
                        await Description.deleteMany({ _id: { $in: existingProduct.descriptions } });
                        console.log(`Deleted descriptions for product with id: ${productId}`);
                    }
                  
                    await Url.deleteMany({ productId: existingProduct.productId });
                    console.log(`Deleted URLs for product with id: ${productId}`);
                
                    await Product.deleteOne({ id: productId });
                    console.log(`Deleted existing product with id: ${productId}`);
                }
                
            }

            if (!SAMEchecksum) {
                // 1. Map and insert ProductType
                const productTypeValue = replaceUnderscoresWithSpaces(produit.informations_generiques.identification_produit.formule.value);
                let productType = await ProductType.findOne({ name: productTypeValue });
                if (!productType) {
                    productType = new ProductType({ name: productTypeValue });
                    await productType.save();
                }

                // 2. Map and insert ProductLocation(s)
                let productLocations = [];
                const destinations = produit.informations_generiques.destinations.destination;

                if (Array.isArray(destinations)) {
                    for (let destination of destinations) {
                        let locationName;
                        let locationType;
                
                        if (destination.arrivee.pays.ville?.iata?.value) {
                            // If iata value exists, use it as the city
                            locationName = destination.arrivee.pays.ville.iata.value;
                            locationType = 'city';
                        } else {
                            // Otherwise, use the ISO code as the country
                            locationName = destination.arrivee.pays['iso_3166-1'].value;
                            locationType = 'country';
                        }
                
                        let productLocation = await ProductLocation.findOne({ name: locationName, type: locationType });
                        if (!productLocation) {
                            productLocation = new ProductLocation({ name: locationName, type: locationType });
                            await productLocation.save();
                        }
                        productLocations.push(productLocation._id);
                    }
                } else if (destinations && destinations.arrivee) { 
                    let locationName;
                    let locationType;
                
                    if (destinations.arrivee.pays.ville?.iata?.value) {
                        // If iata value exists, use it as the city
                        locationName = destinations.arrivee.pays.ville.iata.value;
                        locationType = 'city';
                    } else {
                        // Otherwise, use the ISO code as the country
                        locationName = destinations.arrivee.pays['iso_3166-1'].value;
                        locationType = 'country';
                    }
                
                    let productLocation = await ProductLocation.findOne({ name: locationName, type: locationType });
                    if (!productLocation) {
                        productLocation = new ProductLocation({ name: locationName, type: locationType });
                        await productLocation.save();
                    }
                    productLocations.push(productLocation._id);
                }
                
                // 3. Map and insert ProductSubType
                let productSubTypeValue;
                if (productTypeValue === "circuit accompagne") {
                    productSubTypeValue = produit.informations_formule.circuit_accompagne.hebergements_circuit.hebergement_circuit.type_hebergement.value;
                } else if (productTypeValue === "voyage individuel") {
                    productSubTypeValue = produit.informations_formule.voyage_individuel.hebergement_circuit.type_hebergement.value;
                }
                let productSubType = await ProductSubType.findOne({ name: productSubTypeValue });
                if (!productSubType) {
                    productSubType = new ProductSubType({ name: productSubTypeValue });
                    await productSubType.save();
                }

                // 4. Create product
                const creationDate = new Date();
                const randomLatitude = (Math.random() * 180 - 90).toFixed(6);
                const randomLongitude = (Math.random() * 360 - 180).toFixed(6);

                const productStatus = await ProductStatus.findById('66b0091c2e8dd95521c23c7f');
                const pension = await Pension.findById('66afd257366e409af937a82c');
                const fournisseur = await Fournisseur.findById('66b0aef26e193a43684a8707');

                if (!productStatus || !pension || !fournisseur) {
                    console.error('Default ProductStatus, Pension, or Fournisseur not found.');
                    continue;
                }

                // Create descriptions and get their ObjectIds
                const descriptionIds = await createDescriptions(produit.informations_formule.descriptif.paragraphe);

                const product = new Product({
                    id: productId,
                    productName: replaceHtmlEntities(produit.nom_produit.libelle.text), // Replace HTML entities
                    productType: productType._id,
                    productLocation: productLocations,
                    productSubType: productSubType._id,
                    productStatus: productStatus._id,
                    pension: pension._id,
                    longitude: randomLongitude,
                    latitude: randomLatitude,
                    fournisseur: fournisseur._id,
                    descriptions: descriptionIds, // Store the ObjectIds of descriptions
                    creationDate: creationDate,
                    lastEditDate: null, // Set later when editing
                    checksum: initialChecksum
                });

                // Save the transformed product to the database
                await product.save();

  // 5. Extract and insert URLs
  const urls = produit.informations_formule.descriptif.paragraphe
  .flatMap(paragraph => paragraph.objet?.map(obj => obj.petit?.text) || [])
  .filter(url => url); // Filter out empty URLs

if (urls.length > 0) {
  await createPhotoUrls(product._id, urls);
  console.log(`Inserted URLs for product with id: ${productId}`);
}



                console.log(`Saved product with id: ${product.id}`);
            }

        } catch (error) {
            console.error('Error processing product with id', produit.informations_generiques.references.interne_to.libelle, 'and number:', produit.numero, error);
        }
    }
}

// Configure Multer to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, 'data.xml'); // Rename the file to data.xml
    }
});

const upload = multer({ storage: storage });



async function processJsonFiles() {
    try {
        // Execute the Python script
        await new Promise((resolve, reject) => {
            exec('python xmltojson.py', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing Python script: ${error}`);
                    reject(error);
                }
                console.log('Python script output:', stdout);
                if (stderr) {
                    console.error(`Python script stderr: ${stderr}`);
                }
                resolve();
            });
        });

        const jsonFiles = ['data.json'];

        // Process the JSON files
        for (const file of jsonFiles) {
            console.log(`Processing file: ${file}`);

            const jsonData = JSON.parse(fs.readFileSync(file, 'utf8'));
            const updatedData = removeSymbolsFromObject(jsonData);
            console.log('Modified JSON data:', updatedData);

            await transformAndInsertData(updatedData);
        }

        console.log('All files processed.');
    } catch (error) {
        console.error('Error processing files:', error);
    }
}




// Function to remove '@' and '#' from strings
function removeSymbols(str) {
    return str.replace(/[@#]/g, ''); // Remove @ and # symbols
}

// Function to recursively remove '@' and '#' from keys and values
function removeSymbolsFromObject(obj) {
    if (Array.isArray(obj)) {
        return obj.map(removeSymbolsFromObject);
    } else if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                removeSymbols(key),
                removeSymbolsFromObject(value)
            ])
        );
    } else if (typeof obj === 'string') {
        return removeSymbols(obj);
    }
    return obj;
}




const query = 'mongodb+srv://flameonvanced:7k5GMskzup8T1LeJ@travelagency.0ohfclh.mongodb.net/Agency?retryWrites=true&w=majority&appName=TravelAgency&connectTimeoutMS=30000';





router.post('/upload-xml', upload.single('file'), async (req, res) => {
    try {
        console.log('XML file uploaded successfully.');

        // Process the XML and JSON files
        await processJsonFiles();

        // Send a JSON response indicating success
        res.status(200).json({
            success: true,
            message: 'File processed successfully.'
        });
    } catch (error) {
        console.error('Error processing file:', error);

        // Send a JSON response indicating an error
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing the file.'
        });
    }
});

    
    module.exports = router;

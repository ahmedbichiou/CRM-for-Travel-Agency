const mongoose = require('mongoose');
const { Schema } = mongoose;

// ProductType Schema
const ProductTypeSchema = new Schema({
    name: { type: String, required: true }
});

const ProductType = mongoose.model('ProductType', ProductTypeSchema);

// ProductLocation Schema
const ProductLocationSchema = new Schema({
    type: { type: String, required: true },
    name: { type: String, required: true , unique: true},
});


const ProductLocation = mongoose.model('ProductLocation', ProductLocationSchema);

// ProductStatus Schema
const ProductStatusSchema = new Schema({
    name: { type: String, required: true }
});

const ProductStatus = mongoose.model('ProductStatus', ProductStatusSchema);

// ProductSubType Schema
const ProductSubTypeSchema = new Schema({
    name: { type: String, required: true }
});

const ProductSubType = mongoose.model('ProductSubType', ProductSubTypeSchema);

// Pension Schema
const PensionSchema = new Schema({
    name: { type: String, required: true }
});

const Pension = mongoose.model('Pension', PensionSchema);

// Fournisseur Schema
const FournisseurSchema = new Schema({
    name: { type: String, required: true },
    reference: { type: String, required: true }
});

const Fournisseur = mongoose.model('Fournisseur', FournisseurSchema);

const DescriptionSchema = new Schema({
    title: { type: String, required: true },
    family: { type: String, required: true },
    description: { type: String, required: true },
    ordre: { type: String, required: true },
});
const Description = mongoose.model('Description', DescriptionSchema);


// GeneralDescription Schema
const GeneralDescriptionSchema = new Schema({
    title: { type: String, required: true },
    texte: { type: String, required: true },
    attributionType: { type: String,},
    type: { type: String, },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }] // Array of product references
});
const GeneralDescription = mongoose.model('GeneralDescription', GeneralDescriptionSchema);


const ProductSchema = new Schema({
    id: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    productType: { type: Schema.Types.ObjectId, ref: 'ProductType' },
    productLocation: [{ type: Schema.Types.ObjectId, ref: 'ProductLocation' }],
    descriptions: [{type: Schema.Types.ObjectId, ref: 'Description'} ],
    productStatus: { type: Schema.Types.ObjectId, ref: 'ProductStatus' },
    productSubType: { type: Schema.Types.ObjectId, ref: 'ProductSubType' },
    pension: { type: Schema.Types.ObjectId, ref: 'Pension' },
    longitude: { type: String },
    latitude: { type: String },
    fournisseur: { type: Schema.Types.ObjectId, ref: 'Fournisseur' },
    creationDate: { type: Date, default: Date.now },
    lastEditDate: { type: Date },
    checksum : { type: String} // new field
});
const Product = mongoose.model('Product', ProductSchema);
// Photo Schema
const PhotoSchema = new Schema({
    filename: String,
    metadata: {
        product: mongoose.Types.ObjectId,
        ordre: Number,
        photoType: { type: String, enum: ['List', 'Gallery', 'Panoramic', 'Icon'], default: 'List' },
    },
    uploadDate: { type: Date, default: Date.now }
});



const Photo = mongoose.model('Photo', PhotoSchema);

const urlSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    url: { type: String, required: true },
    ordre: { type: Number, required: true },
    type: { type: String, enum: ['List', 'Gallery', 'Panoramic', 'Icon'], default: 'List' },
});

const Url = mongoose.model('Url', urlSchema);
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  });
  const User = mongoose.model('User', userSchema);
module.exports = {  
    Product,
    ProductType,
    ProductLocation,
    ProductStatus,
    ProductSubType,
    Pension,
    User,
    Url,
    Fournisseur,
    Photo,
    Description,
    GeneralDescription
};

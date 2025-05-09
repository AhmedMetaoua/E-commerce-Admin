import mongoose, { model, models, Schema } from 'mongoose'

const ProductSchema = new Schema({
    title : {type: String, required: true},
    description : String,
    price : {type: Number, required: true},
    quantity: { type: Number, required: true, default: 0 },
    images: {type: [String]},
    category : {type: mongoose.Types.ObjectId, ref:'Category'},
    properties: {type: Object}
}, { timestamps: true });

const Product = models.Product || model('Product', ProductSchema);

export default Product;
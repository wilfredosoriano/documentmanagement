const mongoose = require('mongoose');

const documentTitleSchema = new mongoose.Schema({
    uniqueId: String,
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image : { type: String, required: true },
    date: { type: Date, default: Date.now, required: true }
});

const documentTitleModel = mongoose.model('Titles', documentTitleSchema);
module.exports = documentTitleModel;
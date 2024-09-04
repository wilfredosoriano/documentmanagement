const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    uniqueId: String,
    userId: { type: String, required: true },
    document: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, default: 'preparing', required: true },
    reservedDate: { type: String, required: true },
    createdDate: { type: Date, default: Date.now, required: true },
});

const documentModel = mongoose.model('Documents', documentSchema);
module.exports = documentModel;
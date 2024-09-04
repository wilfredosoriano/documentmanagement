const mongoose = require('mongoose');

const claimableDocumentSchema = new mongoose.Schema({
    uniqueId: String,
    userId: { type: String, required: true },
    document: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, default: 'ready to claim', required: true },
    claimedDate: String,
    claimableDate: { type: String, required: true },
    reservedDate: { type: String, required: true },
    createdDate: { type: Date, default: Date.now, required: true },
});

const claimableDocumentModel = mongoose.model('ClaimableDocuments', claimableDocumentSchema);
module.exports = claimableDocumentModel;
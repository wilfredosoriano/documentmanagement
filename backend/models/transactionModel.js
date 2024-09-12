const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    uniqueId: String,
    userId: String,
    document: { type: String, required: true },
    status: { type: String, default: 'pending', required: true },
    reservedDate: { type: Date, default: Date.now, required: true },
    createdDate: { type: Date, default: Date.now, required: true },
});

const transactionModel = mongoose.model('transactions', transactionSchema);
module.exports = transactionModel;
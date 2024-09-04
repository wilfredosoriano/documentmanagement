const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: String,
    document: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, default: 'pending', required: true },
    reservedDate: { type: Date, default: Date.now, required: true },
    createdDate: { type: Date, default: Date.now, required: true }
});

const appointmentModel = mongoose.model('Appointments', appointmentSchema);
module.exports = appointmentModel;
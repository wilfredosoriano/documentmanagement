const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    middlename: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    hasChangedPassword: { type: Boolean, default: false },
    profile: String,
    role: { type: String, required: true },
    monthlyDeviceCounts: [{
        month: { type: String },
        year: { type: Number },
        Mobile: { type: Number, default: 0 },
        Desktop: { type: Number, default: 0 }
    }],
    date: { type: Date, default: Date.now, required: true },
});

const userModel = mongoose.model('Users', userSchema);
module.exports = userModel;
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
    role: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
});

// userSchema.pre('save', function(next) {
//     const user = this;

//     if (!user.isModified('password')) {
//         return next();
//     }

//     bcrypt.genSalt(10, function(err, salt) {
//         if (err) {
//             return next(err);
//         }

//         bcrypt.hash(user.password, salt, function(err, hash) {
//             if (err) {
//                 return next(err);
//             }

//             user.password = hash;
//             next();
//         });
//     });
// });

const userModel = mongoose.model('Users', userSchema);
module.exports = userModel;
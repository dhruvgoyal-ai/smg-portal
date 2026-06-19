const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CustomerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide a full name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number']
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    role: {
        type: String,
        default: 'customer'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Use "pre-save" middleware to hash the password
CustomerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password in database
CustomerSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Customer', CustomerSchema);


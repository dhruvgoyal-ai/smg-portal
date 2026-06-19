const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

// Helper to generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @route   POST /api/customers/register
// @desc    Register a new customer
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, phone, address } = req.body;

        // Check if customer already exists
        let customer = await Customer.findOne({ email });
        if (customer) {
            return res.status(400).json({ message: 'Customer already exists with this email' });
        }

        // Create new customer
        customer = new Customer({
            fullName,
            email,
            password,
            phone,
            address
        });

        await customer.save();

        res.status(201).json({
            message: 'Customer registered successfully',
            token: generateToken(customer._id),
            customer: {
                id: customer._id,
                fullName: customer.fullName,
                email: customer.email
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/customers/login
// @desc    Authenticate customer & get token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find customer by email (include password for comparison)
        const customer = await Customer.findOne({ email }).select('+password');

        if (customer && (await customer.matchPassword(password))) {
            res.json({
                token: generateToken(customer._id),
                customer: {
                    id: customer._id,
                    fullName: customer.fullName,
                    email: customer.email
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/customers/:id
// @desc    Update customer profile
router.put('/:id', async (req, res) => {
    try {
        const { fullName, phone, address } = req.body;
        
        let customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Update fields
        customer.fullName = fullName || customer.fullName;
        customer.phone = phone || customer.phone;
        if (address) {
            customer.address.city = address.city || customer.address.city;
            customer.address.zipCode = address.zipCode || customer.address.zipCode;
        }

        await customer.save();

        res.json({
            message: 'Profile updated successfully',
            customer: {
                id: customer._id,
                fullName: customer.fullName,
                email: customer.email,
                phone: customer.phone,
                address: customer.address
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/customers

// @desc    Get all customers (for testing)
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;


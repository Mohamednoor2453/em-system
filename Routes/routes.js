const express = require('express');
const path = require('path');
const router = express.Router();
const Employee = require('../model/employee'); // Import the Employee model

// Middleware (if needed)
const isAuthenticated = require('../middleware/authMiddleware.js');

// Home route
router.get('/', (req, res) => {
    res.render('home');
});

// Login route
router.get('/login', (req, res) => {
    res.render('login');
});

// Register route
router.get('/register', (req, res) => {
    res.render('register');
});

// Employee dashboard
router.get('/employee', async (req, res) => {
    try {
        const employees = await Employee.find(); // Fetch employees from the database
        res.render('employee', { employees }); // Pass employees to the view
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Leaves page
router.get('/leaves', (req, res) => {
    res.render('leave');
});

// HR page
router.get('/hr', (req, res) => {
    res.render('humanResource');
});

// Add employee page
router.get('/addEmployee', (req, res) => {
    res.render('addEmployee');
});

module.exports = router;

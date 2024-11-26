const express = require('express');
const path = require('path');
const router = express.Router();

const isAuthenticated = require('../middleware/authMiddleware.js');
// const isAdmin = require('../middleware/adminMiddleware.js');
router.get('/', (req, res) => {
    res.render('home');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/employee', (req, res) => {
    res.render('employee');
});

router.get('/leaves', (req, res) => {
    res.render('leave');
});
router.get('/hr', (req, res) => {
    res.render('humanResource');
});
router.get('/addEmployee', (req, res) => {
    res.render('addEmployee');
});



module.exports = router
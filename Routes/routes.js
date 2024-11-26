const express = require('express');
const path = require('path');
const router = express.Router();

const isAuthenticated = require('../middleware/authMiddleware.js');
// const isAdmin = require('../middleware/adminMiddleware.js');

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/addEmployee', (req, res) => {
    res.render('addEmployee');
});



module.exports = router
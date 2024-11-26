// require('dotenv').config();
const express = require('express');
const User = require('../model/user.js');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const router = express.Router();

// Email format validation
const regExEmail = /^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z]+\.[a-zA-Z]+$/;
const regExPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const adminMail = process.env.ADMIN_EMAIL.trim().toLowerCase();

const emailPass = process.env.EMAIL_PASSWORD;




// User Registration
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!regExEmail.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (!regExPassword.test(password)) {
            return res.status(400).json({
                message: "Password must meet requirements."
            });
        }

        const adminMail = process.env.ADMIN_EMAIL?.toLowerCase();
        let user = await User.findOne({ email: email.trim().toLowerCase() });
        if (user) {
            return res.status(400).json({ message: 'User with that email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const role = email.trim().toLowerCase() === adminMail ? 'admin' : 'user';

        const newUser = new User({
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role: role,
        });

        await newUser.save();
        console.log('New user saved to DB with role:', role);
        res.status(200).redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

//login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(400).json({ message: 'No user with that email', flash: "No user with that email", redirectUrl: '/register' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Incorrect Password', flash: 'Incorrect Password' });
        }

        req.session.user = {
            userId: user._id,
            email: user.email,
            role: user.role
        };
        console.log("Session created:", req.session.user);

        // Log the user role to confirm it's set correctly
        if (req.session.user.role === 'admin') {
            console.log('Admin logged in:', req.session.user.email);
            return res.status(200).redirect('/hr');  // Ensure admin page redirection
        } else {
            console.log('User logged in:', req.session.user.email);
            return res.status(200).redirect('/');  // Default user redirection
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Error in logging out' });
        }

        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully', redirectUrl: '/home' });
    });
});

module.exports = router
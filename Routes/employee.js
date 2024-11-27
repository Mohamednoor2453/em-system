const express = require('express');
const router = express.Router();
const Employee = require('../model/employee'); // Assuming there's a model for employees

// Route to handle profile redirection
router.get('/profile/:id', async (req, res) => {
    try {
        const employeeId = req.params.id; // Get employee ID from URL parameter
        const employee = await Employee.findById(employeeId); // Fetch employee details from the database

        if (!employee) {
            return res.status(404).render('404', { message: "Employee not found" }); // Render a 404 page if not found
        }

        res.render('employeedetail', { employee }); // Render the employee detail page
    } catch (error) {
        console.error("Error fetching employee details:", error.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

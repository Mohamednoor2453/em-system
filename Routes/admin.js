require('dotenv').config();
const express = require('express');
const Employee = require('../model/employee.js');
const isAdmin = require('../middleware/adminMiddleware.js');
const User = require('../model/user.js');



const router = express.Router();


//adding new product
router.post('/addingEmployee', isAdmin, async (req, res) => {
    try {
        const { name, gender, salary, department} = req.body;

        

        // Create and save the new product
        const newEmployee = new Employee({
            name,
            gender,
            salary,
            department
        });

        await newEmployee.save();
        console.log('Employee added successfully');
        res.status(201).redirect('/admin/addedEmployee');
    } catch (error) {
        console.error("Error adding employee:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});






// GET route to fetch and display all products
router.get('/admin/addedEmployees', isAdmin, async (req, res) => {
    try {
        const employee = await Employee.find().sort({ _id: -1 }); // Fetch all products from the database
        res.render('employees', { title: 'employees', products });
    } catch (error) {
        console.error("Error fetching employees:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

 // Add this route in admin.js
router.get('/addedEmployees/:id', isAdmin, async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ success: false, message: "employee not found" });
        }

        res.render('detail', { employee });
    } catch (error) {
        console.error("Error fetching employee:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});


// DELETE a product by ID
router.delete('/admin/deletingEmployee/:id', isAdmin, async (req, res) => {
    const employeeId = req.params.id;

    try {
        const employee = await Employee.findByIdAndDelete(employeeId);

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        

        res.status(200).json({ success: true, message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// Route to get product details for updating
router.get('/updateEmployee/:id', isAdmin, async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        res.render('update', { employee });
    } catch (error) {
        console.error("Error fetching employee for update:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT (Update) a product by ID

router.put('/admin/updateEmployee/:id', isAdmin, async (req, res) => {
    const employeeId = req.params.id;
    const { name, gender, salary, department } = req.body;

    try {
        const existingEmployee = await Employee.findById(employeeId);
        if (!existingEmployee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        // Update employee details
        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            {
                name,
                gender,
                salary,
                department
            },
            { new: true }
        );

        res.redirect('/admin/addedEmployees');
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


module.exports = router;
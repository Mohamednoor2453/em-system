require('dotenv').config();
const express = require('express');
const Employee = require('../model/employee.js');
const isAdmin = require('../middleware/adminMiddleware.js');
const User = require('../model/user.js');



const router = express.Router();


//adding new employee
router.post('/addingEmployee', async (req, res) => {
    try {
        console.log("Request Body: ", req.body);  // Log the request body to debug
        
        const { name, gender, salary, department } = req.body;

        // Validate all required fields are provided
        if (!name || !gender || !salary || !department) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        // Validate salary is a valid number
        const numericSalary = parseFloat(salary);
        if (isNaN(numericSalary)) {
            return res.status(400).json({ success: false, error: "Salary must be a valid number" });
        }

        const newEmployee = new Employee({
            name,
            gender,
            salary: numericSalary,
            department
        });

        await newEmployee.save();
        console.log('Employee added successfully');
        res.status(201).redirect('/admin/admin/addedEmployees');
    } catch (error) {
        console.error("Error adding employee:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});






// GET route to fetch and display all products
router.get('/admin/addedEmployees',  async (req, res) => {
    try {
        const employees = await Employee.find().sort({ _id: -1 }); // Fetch all products from the database
        res.render('addedEmployees', { title: 'employees', employees });
    } catch (error) {
        console.error("Error fetching employees:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

 // Add this route in admin.js
router.get('/addedEmployees/:id',  async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ success: false, message: "employee not found" });
        }

        res.render('edetails', { employee });
    } catch (error) {
        console.error("Error fetching employee:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});


// DELETE a product by ID
router.delete('/admin/deletingEmployee/:id',  async (req, res) => {
    const employeeId = req.params.id;

    try {
        const employee = await Employee.findByIdAndDelete(employeeId);

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        

        res.status(200).json({message: "deleted succesfully"})
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// Route to get product details for updating
router.get('/updateEmployee/:id',  async (req, res) => {
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

// PUT (Update) an employee by ID
router.put('/admin/updateEmployee/:id', async (req, res) => {
    const employeeId = req.params.id;
    const { name, gender, salary, department } = req.body;

    try {
        // Check if the employee exists
        const existingEmployee = await Employee.findById(employeeId);
        if (!existingEmployee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        // Validate salary input
        const numericSalary = parseFloat(salary);
        if (isNaN(numericSalary)) {
            return res.status(400).send("Invalid salary input");
        }

        // Update employee details
        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            {
                name,
                gender,
                salary: numericSalary,
                department
            },
            { new: true } // Return the updated document
        );

        res.redirect('/admin/admin/addedEmployees');
    } catch (error) {
        console.error("Error updating employee:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});


module.exports = router;
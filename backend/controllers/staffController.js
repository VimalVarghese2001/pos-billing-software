const bcrypt = require("bcryptjs");
const User = require("../models/User");


// CREATE STAFF
const createStaff = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone
        } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create staff
        const staff = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "staff",
            phone
        });

        res.status(201).json({
            message: "Staff created successfully",
            staff: {
                id: staff._id,
                name: staff.name,
                email: staff.email,
                role: staff.role,
                phone: staff.phone,
                isActive: staff.isActive
            }
        });

    } catch (error) {
        console.error("Create staff error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET ALL STAFF
const getStaff = async (req, res) => {
    try {
        const staff = await User.find(
            { role: "staff" },
            "-password"
        );

        res.json({
            count: staff.length,
            staff
        });

    } catch (error) {
        console.error("Get staff error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET SINGLE STAFF
const getStaffMember = async (req, res) => {
    try {
        const staff = await User.findOne(
            {
                _id: req.params.id,
                role: "staff"
            },
            "-password"
        );

        if (!staff) {
            return res.status(404).json({
                message: "Staff member not found"
            });
        }

        res.json({
            staff
        });

    } catch (error) {
        console.error("Get staff error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// UPDATE STAFF
const updateStaff = async (req, res) => {
    try {
        const staff = await User.findOne({
            _id: req.params.id,
            role: "staff"
        });

        if (!staff) {
            return res.status(404).json({
                message: "Staff member not found"
            });
        }

        const {
            name,
            email,
            password,
            phone,
            isActive
        } = req.body;

        // Update normal fields
        if (name !== undefined) {
            staff.name = name;
        }

        if (email !== undefined) {
            staff.email = email;
        }

        if (phone !== undefined) {
            staff.phone = phone;
        }

        if (isActive !== undefined) {
            staff.isActive = isActive;
        }

        // Update password only if provided
        if (password) {
            staff.password = await bcrypt.hash(password, 10);
        }

        await staff.save();

        res.json({
            message: "Staff updated successfully",
            staff: {
                id: staff._id,
                name: staff.name,
                email: staff.email,
                role: staff.role,
                phone: staff.phone,
                isActive: staff.isActive
            }
        });

    } catch (error) {
        console.error("Update staff error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// DELETE STAFF
const deleteStaff = async (req, res) => {
    try {
        const staff = await User.findOne({
            _id: req.params.id,
            role: "staff"
        });

        if (!staff) {
            return res.status(404).json({
                message: "Staff member not found"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({
            message: "Staff deleted successfully"
        });

    } catch (error) {
        console.error("Delete staff error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createStaff,
    getStaff,
    getStaffMember,
    updateStaff,
    deleteStaff
};
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
    console.log(req.body)
    try {
        const {
            name,
            rollNumber,
            password,
            cgpa,
            program,
            department,
            tenthGradePercentage,
            twelfthGradePercentage,
            specialization,
            pwdCategory,
            yearOfAdmission,
            yearOfGraduation
        } = req.body;

        // Check if roll number already exists
        const existingUser = await User.findOne({ rollNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'Roll number already registered' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            rollNumber,
            password: hashedPassword,
            cgpa,
            program,
            department,
            tenthGradePercentage,
            twelfthGradePercentage,
            specialization,
            pwdCategory,
            yearOfAdmission,
            yearOfGraduation
        });

        // Save user to database
        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { rollNumber, password } = req.body;
        console.log(req.body);

        // Check if user exists with given roll number
        const user = await User.findOne({ rollNumber });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, rollNumber: user.rollNumber}, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: { name: user.name, rollNumber: user.rollNumber } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
exports.getuser = async (req, res) => {
    try {
        const { rollNumber } = req.body;
        console.log(req.body);

        // Check if user exists with given roll number
        const user = await User.findOne({ rollNumber });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }
        res.json({ user: { user } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
};

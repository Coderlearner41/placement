const User = require('../models/user');
const Company = require('../models/company');
const { sendNotificationToDepartment } = require('../websocket');

exports.registerCompany = async (req, res) => {
    console.log(req.body);
    try {
        const { companyName, recruiterName, contactNumber, jobTitle, profilesCount, announcedDate, branchesOpenFor } = req.body;

        // Save company in the database
        const newCompany = new Company({ 
            name: companyName, 
            recruiterName, 
            contactNumber, 
            jobTitle, 
            profilesCount, 
            branchesOpenFor,
            announcedDate
        });

        await newCompany.save();

        // Fetch students whose department matches the selected branches
        const students = await User.find({ department: { $in: newCompany.branchesOpenFor } });

        // Notification message
        const message = {
            type: "NEW_COMPANY",
            title: "New Company Registered!",
            body: `A new company, ${companyName}, is hiring for ${newCompany.jobTitle}. Check it out!`,
        };

        // Send WebSocket notification only to relevant students
        sendNotificationToDepartment(message, newCompany.branchesOpenFor);

        res.status(201).json({ msg: 'Company registered and notification sent!' });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().sort({ announcedDate: -1 }); // Fetch latest first
        res.status(200).json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


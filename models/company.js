const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    recruiterName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    jobTitle: { type: String, required: true },
    profilesCount: { type: Number, required: true },
    branchesOpenFor: [{ type: String }], // Array to store selected branches
    announcedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', CompanySchema);

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // Ensure secure storage with hashing in production
    cgpa: { type: String },
    program: { type: String },
    department: { type: String },
    tenthGradePercentage: { type: String },
    twelfthGradePercentage: { type: String },
    specialization: { type: String },
    pwdCategory: { type: String, enum: ['Yes', 'No'], default: 'No' },
    yearOfAdmission: { type: String },
    yearOfGraduation: { type: String },
    createdAt: { type: Date, default: Date.now },
    fcmToken: { type: String, required: false }
});

module.exports = mongoose.model('User', UserSchema);

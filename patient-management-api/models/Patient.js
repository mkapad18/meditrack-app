const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    address: { type: String },
    contactNumber: { type: String },
    status: { type: String, enum: ['Critical', 'Stable'], default: 'Stable' }
})

module.exports = mongoose.model('Patient', PatientSchema);
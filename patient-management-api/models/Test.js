const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dataType: {
        type: String,
        enum: ['Blood Pressure', 'Respiratory Rate', 'Blood Oxygen Level', 'Heartbeat Rate'],
        required: true,
    },
    reading: {
        type: Number,
        required: true,
    },
    testDate: {
        type: Date,
        required: true,
    },
    criticalFlag: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('Test', TestSchema)
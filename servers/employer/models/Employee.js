const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    attestations: [{
        type: {
            type: String,
            enum: ['income'],
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'EUR'
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        signature: {
            type: String,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

employeeSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Employee', employeeSchema); 
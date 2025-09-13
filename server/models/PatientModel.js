const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientsSchema = new Schema({
    id: { type: String, default: () => new mongoose.Types.ObjectId().toHexString(), unique: true }, // Custom ID for consistency if desired, otherwise _id is default
        name: { type: String, required: true },
    dob: { type: Date },
    gender: { type: String },
    contact: {
        phone: { type: String },
        email: { type: String }
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String },
        country: { type: String }
    },
    medicalHistory: [{ type: String }],
    allergies: [{ type: String }],
    medications: [{ type: String }],
    insuranceProvider: { type: String },
    insurancePolicyNumber: { type: String },
    emergencyContact: {
        name: { type: String },
        phone: { type: String },
        relation: { type: String }
    },
    status: { type: String, enum: ['active', 'inactive', 'deceased'], default: 'active' }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// If you have virtuals or methods, add them here
// patientsSchema.virtual('fullName').get(function() {
//     return `${this.firstName} ${this.lastName}`;
// });

module.exports = mongoose.model('Patient', patientsSchema);

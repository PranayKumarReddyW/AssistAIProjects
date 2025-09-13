const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentsSchema = new Schema({
    id: { type: String, default: () => new mongoose.Types.ObjectId().toHexString(), unique: true }, // Custom ID for consistency if desired, otherwise _id is default
        patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // Store as string for flexibility (e.g., "10:00 AM") or use Date for full timestamp
    type: { type: String, enum: ['Medical Examination', 'Follow-up', 'New Patient', 'Emergency'], default: 'Follow-up' },
    status: { type: String, enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'], default: 'scheduled' },
    duration: { type: Number, default: 30 }, // in minutes
    notes: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// If you have virtuals or methods, add them here
// appointmentsSchema.virtual('fullName').get(function() {
//     return `${this.firstName} ${this.lastName}`;
// });

module.exports = mongoose.model('Appointment', appointmentsSchema);

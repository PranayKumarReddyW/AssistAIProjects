const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultationsSchema = new Schema({
    id: { type: String, default: () => new mongoose.Types.ObjectId().toHexString(), unique: true }, // Custom ID for consistency if desired, otherwise _id is default
        patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    notes: { type: String },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    videoUrl: { type: String }, // for telemedicine
    transcriptionId: { type: Schema.Types.ObjectId, ref: 'Transcription' }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// If you have virtuals or methods, add them here
// consultationsSchema.virtual('fullName').get(function() {
//     return `${this.firstName} ${this.lastName}`;
// });

module.exports = mongoose.model('Consultation', consultationsSchema);

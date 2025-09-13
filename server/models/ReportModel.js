const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportsSchema = new Schema({
    id: { type: String, default: () => new mongoose.Types.ObjectId().toHexString(), unique: true }, // Custom ID for consistency if desired, otherwise _id is default
        patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    consultationId: { type: Schema.Types.ObjectId, ref: 'Consultation' },
    type: { type: String, enum: ['Medical Examination Report', 'Follow-up', 'Specialist', 'Emergency'], required: true },
    findings: [{ type: String }],
    recommendations: [{ type: String }],
    status: { type: String, enum: ['draft', 'completed', 'reviewed', 'sent'], default: 'draft' },
    fileUrl: { type: String }, // PDF or document URL
    riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// If you have virtuals or methods, add them here
// reportsSchema.virtual('fullName').get(function() {
//     return `${this.firstName} ${this.lastName}`;
// });

module.exports = mongoose.model('Report', reportsSchema);

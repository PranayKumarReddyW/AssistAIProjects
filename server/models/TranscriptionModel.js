const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transcriptionsSchema = new Schema({
    id: { type: String, default: () => new mongoose.Types.ObjectId().toHexString(), unique: true }, // Custom ID for consistency if desired, otherwise _id is default
        consultationId: { type: Schema.Types.ObjectId, ref: 'Consultation', required: true },
    fileUrl: { type: String, required: true }, // audio/video URL
    result: { type: String }, // transcribed text
    status: { type: String, enum: ['pending', 'completed', 'error'], default: 'pending' }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// If you have virtuals or methods, add them here
// transcriptionsSchema.virtual('fullName').get(function() {
//     return `${this.firstName} ${this.lastName}`;
// });

module.exports = mongoose.model('Transcription', transcriptionsSchema);

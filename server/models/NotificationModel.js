const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationsSchema = new Schema({
    id: { type: String, default: () => new mongoose.Types.ObjectId().toHexString(), unique: true }, // Custom ID for consistency if desired, otherwise _id is default
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['appointment', 'report', 'system', 'message'], default: 'system' },
    message: { type: String, required: true },
    read: { type: Boolean, default: false }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// If you have virtuals or methods, add them here
// notificationsSchema.virtual('fullName').get(function() {
//     return `${this.firstName} ${this.lastName}`;
// });

module.exports = mongoose.model('Notification', notificationsSchema);

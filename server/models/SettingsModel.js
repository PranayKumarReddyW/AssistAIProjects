const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingssSchema = new Schema({
    id: { type: String, default: () => new mongoose.Types.ObjectId().toHexString(), unique: true }, // Custom ID for consistency if desired, otherwise _id is default
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    preferences: {
        theme: { type: String, default: 'light' },
        language: { type: String, default: 'en-US' }
    },
    notificationSettings: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
        appointmentReminders: { type: Boolean, default: true },
        reportAlerts: { type: Boolean, default: true },
        systemUpdates: { type: Boolean, default: true }
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// If you have virtuals or methods, add them here
// settingssSchema.virtual('fullName').get(function() {
//     return `${this.firstName} ${this.lastName}`;
// });

module.exports = mongoose.model('Settings', settingssSchema);

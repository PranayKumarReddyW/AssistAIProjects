const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    id: { type: String, default: () => new mongoose.Types.ObjectId().toHexString(), unique: true }, // Custom ID for consistency if desired, otherwise _id is default
        name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['doctor', 'admin', 'staff', 'patient'], default: 'patient' },
    phone: { type: String },
    avatarUrl: { type: String },
    lastLogin: { type: Date },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// If you have virtuals or methods, add them here
// usersSchema.virtual('fullName').get(function() {
//     return `${this.firstName} ${this.lastName}`;
// });

module.exports = mongoose.model('User', usersSchema);

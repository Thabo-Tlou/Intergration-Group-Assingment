import mongoose from 'mongoose';

const DriverSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    staffNumber: {
        type: String,
        required: true,
        unique: true,
    },
    identityNumber: {
        type: String,
        required: true,
    },
    qualifications: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    contractStatus: {
        type: String,
        enum: ['active', 'terminated'],
        default: 'active',
    },
}, { timestamps: true });

export default mongoose.model('Driver', DriverSchema);
import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    staffNumber: {
        type: String,
        required: true,
        unique: true, // Ensure that staff number is unique
    },
    fullName: {
        type: String,
        required: true,
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
        default: 'active', // Default to 'active'
    },
    points: {
        type: Number,
        default: 0, // Points start at 0
    },
    academicTraining: {
        type: [String], // Array to store names of academic qualifications
    },
    professionalTraining: {
        type: [String], // Array to store names of professional training
    }
}, { timestamps: true });


const Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee;
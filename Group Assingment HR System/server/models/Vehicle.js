import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    vin: { type: String, required: true, unique: true }, // Vehicle Identification Number
    model: { type: String, required: true },
    mileage: { type: Number, required: true }, // Mileage in kilometers/miles
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false }, // Reference to an Employee (driver)
    status: {
        type: String,
        enum: ['available', 'in use', 'sold', 'on service'],
        default: 'available'
    },
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
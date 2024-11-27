// database.js
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://tlouthabo07:tlouthabo@employment.sg91j.mongodb.net/?retryWrites=true&w=majority&appName=Employment', {
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit(1); // Exit the process with failure
    }
};

export default connectDB;

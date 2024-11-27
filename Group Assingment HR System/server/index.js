import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import connectDB from './db.js';  // Import the connectDB function


// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser for JSON requests

// Connect to MongoDB (via connectDB function)
connectDB();

/// Employee Schema definition
const employeeSchema = new mongoose.Schema({
    staffNumber: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    identityNumber: { type: String, required: true },
    qualifications: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    contractStatus: { type: String, enum: ['active', 'terminated'], default: 'active' },
    points: { type: Number, default: 0 },
    pointsHistory: [
      {
        points: { type: Number },
        reason: { type: String },
        date: { type: Date },
      },
    ],
    academicTraining: { type: [String] },
    professionalTraining: { type: [String] },
  }, { timestamps: true });
  
  // Check if the model is already defined (to avoid redeclaration)
  const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
  
  export default Employee;
// Routes

// GET all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees', error });
  }
});

// POST a new employee
app.post('/employees', async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    if (error.code === 11000) {  // Duplicate key error code in MongoDB
      return res.status(400).json({ message: 'Staff number must be unique' });
    }
    res.status(500).json({ message: 'Failed to save employee', error: error.message });
  }
});

// PUT (update) an employee
app.put('/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Error updating employee', error });
  }
});

// DELETE an employee
app.delete('/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Error deleting employee', error });
  }
});

// Add points to employee
app.patch('/employees/:id/add-points', async (req, res) => {
  const { id } = req.params;
  const { points, reason } = req.body;

  try {
    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).send('Employee not found');

    // Add points to the employee's existing points
    employee.points += points;

    // Optionally, store the reason for adding points in a log/history
    employee.pointsHistory.push({ points, reason, date: new Date() });

    await employee.save();

    res.status(200).send('Points added successfully');
  } catch (error) {
    console.error('Error adding points:', error);
    res.status(500).send('An error occurred while adding points.');
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

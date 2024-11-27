import React, { useState } from 'react';
import axios from 'axios';
import '../styles/EmployeeManager.css';

const EmployeeManager = () => {
  const [formData, setFormData] = useState({
    staffNumber: '',
    fullName: '',
    identityNumber: '',
    qualifications: '',
    position: '',
    salary: '',
  });
  const [currentEmployee, setCurrentEmployee] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for adding/updating employees
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.salary !== '') {
      formData.salary = parseFloat(formData.salary); // Ensure salary is a number
    }
    try {
      if (currentEmployee) {
        await axios.put(
          `http://localhost:5000/employees/${currentEmployee._id}`,
          formData
        );
        alert('Employee updated successfully!');
      } else {
        await axios.post('http://localhost:5000/employees', formData);
        alert('Employee added successfully!');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('An error occurred while saving the employee.');
    }
  };

  // Reset form to default state
  const resetForm = () => {
    setFormData({
      staffNumber: '',
      fullName: '',
      identityNumber: '',
      qualifications: '',
      position: '',
      salary: '',
    });
    setCurrentEmployee(null);
  };

  return (
    <div className="employee-manager">x
      {/* Form Section */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1>Adding New Recruits</h1>
          <h2>{currentEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
          {Object.keys(formData).map((field) => (
            <div key={field} className="form-field">
              <label>
                {field.replace(/([A-Z])/g, ' $1')}:
              </label>
              <input
                type={field === 'salary' ? 'number' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}
          <button type="submit" className="submit-button">
            {currentEmployee ? 'Update Employee' : 'Add Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeManager;

import React, { useState } from 'react';
import api from './api';
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.salary !== '') {
      formData.salary = parseFloat(formData.salary);
    }
    try {
      if (currentEmployee) {
        await api.put(`/employees/${currentEmployee._id}`, formData);
        alert('Employee updated successfully!');
      } else {
        await api.post('/employees', formData);
        alert('Employee added successfully!');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('An error occurred while saving the employee.');
    }
  };

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
    <div className="employee-manager">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1>Manage Employees</h1>
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

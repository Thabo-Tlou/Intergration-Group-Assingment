import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentEmployee, setCurrentEmployee] = useState(null);

  // Fetch employees from backend
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employees');
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle employee deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:5000/employees/${id}`);
        alert('Employee deleted successfully!');
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('An error occurred while deleting the employee.');
      }
    }
  };

  // Handle employee update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!currentEmployee) return;

    try {
      await axios.put(`http://localhost:5000/employees/${currentEmployee._id}`, currentEmployee);
      alert('Employee updated successfully!');
      fetchEmployees();
      setCurrentEmployee(null); // Reset the form after update
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('An error occurred while updating the employee.');
    }
  };

  // Handle form input changes for updating employee details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filter employees based on search term
  const filteredEmployees = Array.isArray(employees)
    ? employees.filter((employee) =>
        employee.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Handle adding points to employee
  const handleAddPoints = async (employeeId, points, reason) => {
    try {
      const response = await axios.patch(`http://localhost:5000/employees/${employeeId}/add-points`, {
        points,
        reason,
      });
      console.log('Points added:', response.data);
      fetchEmployees(); // Refresh the employee list after adding points
    } catch (error) {
      console.error('Error adding points:', error);
    }
  };

  return (
    <div className="employee-list">
      <h1>Employee List</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Update form */}
      {currentEmployee && (
        <div className="update-form">
          <h2>Edit Employee</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-field">
              <label>Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={currentEmployee.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-field">
              <label>Position:</label>
              <input
                type="text"
                name="position"
                value={currentEmployee.position}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-field">
              <label>Salary:</label>
              <input
                type="number"
                name="salary"
                value={currentEmployee.salary}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Update Employee
            </button>
          </form>
        </div>
      )}

      {/* Employee list display */}
      {filteredEmployees.length > 0 ? (
        filteredEmployees.map((employee) => (
          <div key={employee._id} className="employee-card">
            <p>Staff Number: {employee.staffNumber}</p>
            <p>Name: {employee.fullName}</p>
            <p>Position: {employee.position}</p>
            <p>Salary: LSL {employee.salary}</p>
            <p>Points: {employee.points}</p>

            {/* Buttons for adding points */}
            <div className="qualification-buttons">
              <button
                onClick={() => handleAddPoints(employee._id, 10, 'Academic Qualification')}
              >
                Add Academic Qualification (+10 Points)
              </button>
              <button
                onClick={() => handleAddPoints(employee._id, 15, 'Professional Training')}
              >
                Add Professional Training (+15 Points)
              </button>
            </div>

            {/* Update and Delete buttons */}
            <button onClick={() => setCurrentEmployee(employee)} className="edit-button">
              Edit
            </button>
            <button onClick={() => handleDelete(employee._id)} className="delete-button">
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No employees found.</p>
      )}
    </div>
  );
};

export default EmployeeList;

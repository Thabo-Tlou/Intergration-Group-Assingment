import React, { useState, useEffect } from 'react';
import api from './api';
import '../styles/EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        alert('Employee deleted successfully!');
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('An error occurred while deleting the employee.');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!currentEmployee) return;

    try {
      await api.put(`/employees/${currentEmployee._id}`, currentEmployee);
      alert('Employee updated successfully!');
      fetchEmployees();
      setCurrentEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('An error occurred while updating the employee.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPoints = async (employeeId, points, reason) => {
    try {
      const response = await api.patch(`/employees/${employeeId}/add-points`, {
        points,
        reason,
      });
      console.log('Points added:', response.data);
      fetchEmployees(); // Refresh the employee list after adding points
      alert(`Successfully added ${points} points for: ${reason}`);
    } catch (error) {
      console.error('Error adding points:', error);
      alert('An error occurred while adding points.');
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="employee-list">
      <h1>Manage Employee Points</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

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

      {filteredEmployees.length > 0 ? (
        filteredEmployees.map((employee) => (
          <div key={employee._id} className="employee-card">
            <p><strong>Staff Number:</strong> {employee.staffNumber}</p>
            <p><strong>Name:</strong> {employee.fullName}</p>
            <p><strong>Position:</strong> {employee.position}</p>
            <p><strong>Points:</strong> {employee.points}</p>

            <div className="points-buttons">
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
              <button
                onClick={() => handleAddPoints(employee._id, 5, 'Outstanding Performance')}
              >
                Add Outstanding Performance (+5 Points)
              </button>
            </div>

            <button
              onClick={() => setCurrentEmployee(employee)}
              className="edit-button"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(employee._id)}
              className="delete-button"
            >
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

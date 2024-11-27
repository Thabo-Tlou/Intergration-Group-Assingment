import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/VehicleManager.css'

const VehicleManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    vin: '',
    model: '',
    mileage: '',
    driverId: '',
    status: 'available',
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch employees (to assign as drivers)
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchVehicles();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for adding/updating vehicle
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/vehicles', formData);
      alert('Vehicle added successfully!');
      setFormData({
        vin: '',
        model: '',
        mileage: '',
        driverId: '',
        status: 'available',
      });
      fetchVehicles();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Error adding vehicle.');
    }
  };

  // Handle searching for vehicles
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/vehicles/search?query=${searchTerm}`);
      setVehicles(response.data);
    } catch (error) {
      console.error('Error searching vehicles:', error);
    }
  };

  // Handle updating vehicle details (mileage, status, driver)
  const handleUpdate = async (id) => {
    const newMileage = prompt('Enter new mileage:');
    const newStatus = prompt('Enter new status (available, in use, sold, on service):');
    const newDriver = prompt('Enter driver ID (or leave blank for no driver):');
    try {
      await axios.put(`http://localhost:5000/vehicles/${id}`, {
        mileage: newMileage,
        status: newStatus,
        driverId: newDriver || undefined,
      });
      alert('Vehicle updated successfully!');
      fetchVehicles();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      alert('Error updating vehicle.');
    }
  };

  return (
    <div className="vehicle-manager">
      <h1>Vehicle Management</h1>

      {/* Vehicle search */}
      <div>
        <input
          type="text"
          placeholder="Search by VIN or Model"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Add/Edit Vehicle Form */}
      <form onSubmit={handleSubmit}>
        <h2>Add New Vehicle</h2>
        <input
          type="text"
          name="vin"
          value={formData.vin}
          onChange={handleInputChange}
          placeholder="VIN"
          required
        />
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleInputChange}
          placeholder="Model"
          required
        />
        <input
          type="number"
          name="mileage"
          value={formData.mileage}
          onChange={handleInputChange}
          placeholder="Mileage"
          required
        />
        <select name="driverId" onChange={handleInputChange} value={formData.driverId}>
          <option value="">Select Driver</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.fullName}
            </option>
          ))}
        </select>
        <select name="status" onChange={handleInputChange} value={formData.status}>
          <option value="available">Available</option>
          <option value="in use">In Use</option>
          <option value="sold">Sold</option>
          <option value="on service">On Service</option>
        </select>
        <button type="submit">Add Vehicle</button>
      </form>

      {/* Display vehicles */}
      <div>
        <h2>Vehicles</h2>
        <ul>
          {vehicles.map((vehicle) => (
            <li key={vehicle._id}>
              <p>
                VIN: {vehicle.vin}, Model: {vehicle.model}, Mileage: {vehicle.mileage}, Status: {vehicle.status}
              </p>
              <p>Driver: {vehicle.driver ? vehicle.driver.fullName : 'No driver assigned'}</p>
              <button onClick={() => handleUpdate(vehicle._id)}>Update</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VehicleManager;

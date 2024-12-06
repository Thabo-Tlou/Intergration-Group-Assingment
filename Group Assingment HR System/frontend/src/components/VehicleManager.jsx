import React, { useState, useEffect } from 'react';
import api from './api';
import '../styles/VehicleManager.css';

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

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles');
      setVehicles(response.data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vehicles', formData);
      alert('Vehicle added successfully!');
      fetchVehicles();
      setFormData({ vin: '', model: '', mileage: '', driverId: '', status: 'available' });
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('An error occurred while adding the vehicle.');
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="vehicle-manager">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search vehicles by model"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <h1>Manage Vehicles</h1>
        <h2>Add New Vehicle</h2>
        {Object.keys(formData).map((field) => (
          <div key={field} className="form-field">
            <label>{field.replace(/([A-Z])/g, ' $1')}:</label>
            <input
              type={field === 'mileage' ? 'number' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              required
            />
          </div>
        ))}
        <button type="submit" className="submit-button">Add Vehicle</button>
      </form>

      <div className="vehicle-list">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle._id} className="vehicle-card">
            <p>VIN: {vehicle.vin}</p>
            <p>Model: {vehicle.model}</p>
            <p>Mileage: {vehicle.mileage} km</p>
            <p>Status: {vehicle.status}</p>
            <p>Driver: {vehicle.driverId ? `${vehicle.driverId}` : 'None Assigned'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleManager;

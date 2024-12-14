import React, { useState, useEffect } from 'react';
import { fetchVehicles, addVehicle, updateVehicleStatus, deleteVehicle } from '../services/vehicleService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './VehicleTable.css';
import Pagination from './pagination'; // Import Pagination Component

const VehicleTable = ({ userRole }) => {
  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // Success or error
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 5; // Number of vehicles per page
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  useEffect(() => {
    fetchVehiclesData();
  }, [userRole]);

  const fetchVehiclesData = async () => {
    try {
      const response = await fetchVehicles();
      if (response) {
        setVehicles(response);
      } else {
        console.error('Vehicles data is undefined'); // Debugging
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error); // Debugging
      setMessageType('danger');
      setMessage('Failed to fetch vehicles');
    }
  };

  const handleAddVehicle = async () => {
    const name = prompt('Enter vehicle name:');
    const status = prompt('Enter vehicle status:');
    if (name && status) {
      try {
        await addVehicle({ name, status });
        setMessageType('success');
        setMessage('Vehicle added successfully');
        fetchVehiclesData();
      } catch (error) {
        console.error('Error adding vehicle:', error); // Debugging
        setMessageType('danger');
        setMessage('Failed to add vehicle');
      }
    }
  };

  const handleUpdateStatus = async (id) => {
    const status = prompt('Enter new status:');
    if (status) {
      try {
        await updateVehicleStatus(id, status);
        setMessageType('success');
        setMessage('Vehicle status updated successfully');
        fetchVehiclesData();
      } catch (error) {
        console.error('Error updating vehicle status:', error); // Debugging
        setMessageType('danger');
        setMessage('Failed to update vehicle status');
      }
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicle(id);
        setMessageType('success');
        setMessage('Vehicle deleted successfully');
        fetchVehiclesData();
      } catch (error) {
        console.error('Error deleting vehicle:', error); // Debugging
        setMessageType('danger');
        setMessage('Failed to delete vehicle');
      }
    }
  };

  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = sortedVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Vehicle Management Dashboard</h2>
      {userRole === 'admin' && <button onClick={handleAddVehicle} className="btn btn-success mb-3">Add Vehicle</button>}
      {message && <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
        {message}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>}
      <table className="table table-hover vehicle-table">
        <thead>
          <tr>
            <th onClick={() => requestSort('name')} className="sortable">Vehicle Name</th>
            <th onClick={() => requestSort('status')} className="sortable">Status</th>
            <th>Last Updated</th>
            {userRole === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {currentVehicles.length > 0 ? currentVehicles.map((vehicle) => (
            <tr key={vehicle._id}>
              <td>{vehicle.name}</td>
              <td>{vehicle.status}</td>
              <td>{vehicle.lastUpdated ? new Date(vehicle.lastUpdated).toLocaleDateString() : 'Not Available'}</td>
              {userRole === 'admin' && (
                <td>
                  <button onClick={() => handleUpdateStatus(vehicle._id)} className="btn btn-primary update-status-button">Update Status</button>
                  <button onClick={() => handleDeleteVehicle(vehicle._id)} className="btn btn-danger ms-2">Delete</button>
                </td>
              )}
            </tr>
          )) : <tr><td colSpan="4">No vehicles found</td></tr>}
        </tbody>
      </table>
      <Pagination vehiclesPerPage={vehiclesPerPage} totalVehicles={vehicles.length} paginate={paginate} />
    </div>
  );
};

export default VehicleTable;

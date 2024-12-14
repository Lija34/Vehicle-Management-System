import Vehicle from '../models/Vehicle.js';

export const addVehicle = async (req, res) => {
  const { name, status } = req.body;
  const newVehicle = new Vehicle({ name, status });
  try {
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
};

export const updateVehicleStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, { status, lastUpdated: Date.now() }, { new: true });
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vehicle status' });
  }
};

export const fetchAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
};

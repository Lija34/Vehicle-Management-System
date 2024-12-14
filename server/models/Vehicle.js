import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  status: { 
    type: String,
     required: true 
    },
  lastUpdated: { 
    type: Date, 
    default: Date.now }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;

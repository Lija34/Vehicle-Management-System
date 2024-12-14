import express from 'express';
import { fetchAllVehicles, addVehicle, updateVehicleStatus, deleteVehicle } from '../controllers/vehicleController.js';
import { requireAuth, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/all', requireAuth, fetchAllVehicles);
router.post('/add', requireAuth, checkRole(['admin']), addVehicle);
router.put('/update/:id', requireAuth, checkRole(['admin']), updateVehicleStatus);
router.delete('/delete/:id', requireAuth, checkRole(['admin']), deleteVehicle);

export default router;

import express from 'express'
import {
  getAllDistributors,
  getDistributor,
  createDistributor,
  updateDistributor,
  deleteDistributor,
  addFarmerController,
  updateFarmerController,
  deleteFarmerController,
  getAllCattleController,
  getCattleByIdController,
  addCattleController,
  updateCattleController,
  deleteCattleController,
} from '../controller/distributorController.js'

const router = express.Router()

// ===============================
// 🔹 Distributor Routes
// ===============================
router.get('/', getAllDistributors)
router.get('/:id', getDistributor)
router.post('/', createDistributor)
router.put('/:id', updateDistributor)
router.delete('/:id', deleteDistributor)

// ===============================
// 🔹 Farmer Nested Routes
// ===============================
router.post('/:distributorId/farmers', addFarmerController)
router.put('/:distributorId/farmers/:farmerId', updateFarmerController)
router.delete('/:distributorId/farmers/:farmerId', deleteFarmerController)

// ===============================
// 🔹 Cattle Nested Routes
// ===============================
// GET all cattle under a farmer
router.get('/:distributorId/farmers/:farmerId/cattle', getAllCattleController)

// GET a single cattle by ID
router.get('/:distributorId/farmers/:farmerId/cattle/:cattleId', getCattleByIdController)

// Add a new cattle
router.post('/:distributorId/farmers/:farmerId/cattle', addCattleController)

// Update existing cattle
router.put('/:distributorId/farmers/:farmerId/cattle/:cattleId', updateCattleController)

// Delete cattle
router.delete('/:distributorId/farmers/:farmerId/cattle/:cattleId', deleteCattleController)

export default router

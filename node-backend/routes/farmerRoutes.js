import express from 'express'
import {
  getAllFarmers,
  getFarmerById,
  getFarmersByDistributor,
  createFarmer,
  updateFarmer,
  deleteFarmer,
} from '../controller/farmerController.js'

const router = express.Router()

// CRUD
router.get('/', getAllFarmers)
router.get('/:id', getFarmerById)
router.post('/', createFarmer)
router.put('/:id', updateFarmer)
router.delete('/:id', deleteFarmer)

export default router

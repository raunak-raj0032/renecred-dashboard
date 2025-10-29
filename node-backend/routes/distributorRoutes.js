import express from 'express'
import {
  getAllDistributors,
  getDistributor,
  createDistributor,
  updateDistributor,
  deleteDistributor,
} from '../controller/distributorController.js'

const router = express.Router()

// ✅ Basic CRUD routes
router.get('/', getAllDistributors)
router.get('/:id', getDistributor)
router.post('/', createDistributor)
router.put('/:id', updateDistributor)
router.delete('/:id', deleteDistributor)

export default router

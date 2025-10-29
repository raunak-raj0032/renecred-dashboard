import express from 'express'
import { farmerController } from '../controller/farmerController.js'

const router = express.Router()

// CRUD
router.get('/', farmerController.getAll)
router.get('/:id', farmerController.getById)
router.post('/', farmerController.create)
router.put('/:id', farmerController.update)
router.delete('/:id', farmerController.remove)

// Nested under distributor
router.get('/distributor/:distributorId', farmerController.getByDistributor)
router.post('/distributor/:distributorId', farmerController.create)

export default router

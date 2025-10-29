import express from 'express'
import { cattleController } from '../controller/cattleController.js'

const router = express.Router()

// ✅ Basic CRUD routes
router.get('/', cattleController.getAll)
router.get('/:id', cattleController.getById)
router.post('/', cattleController.create)
router.put('/:id', cattleController.update)
router.delete('/:id', cattleController.remove)

export default router

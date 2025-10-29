import express from 'express'
import {
  getAllCattle,
  getCattleById,
  createCattle,
  updateCattle,
  deleteCattle,
} from '../controller/cattleController.js'

const router = express.Router()

// ✅ Basic CRUD routes
router.get('/', getAllCattle)
router.get('/:id', getCattleById)
router.post('/', createCattle)
router.put('/:id', updateCattle)
router.delete('/:id', deleteCattle)

export default router

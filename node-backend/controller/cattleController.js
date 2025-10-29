import { cattleService } from '../services/cattleService.js'

export const cattleController = {
  async getAll(req, res) {
    try {
      const cattle = await cattleService.getAll()
      res.json(cattle)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async getById(req, res) {
    try {
      const cattle = await cattleService.getById(req.params.id)
      res.json(cattle)
    } catch (err) {
      res.status(404).json({ error: err.message })
    }
  },

  async create(req, res) {
    try {
      const cattle = await cattleService.create(req.body)
      res.status(201).json(cattle)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async update(req, res) {
    try {
      const cattle = await cattleService.update(req.params.id, req.body)
      res.json(cattle)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async remove(req, res) {
    try {
      const result = await cattleService.remove(req.params.id)
      res.json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },
}

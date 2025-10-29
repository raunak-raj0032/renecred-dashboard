import { farmerService } from '../services/farmerService.js'

export const farmerController = {
  async getAll(req, res) {
    try {
      const farmers = await farmerService.getAll()
      res.json(farmers)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async getById(req, res) {
    try {
      const farmer = await farmerService.getById(req.params.id)
      res.json(farmer)
    } catch (err) {
      res.status(404).json({ error: err.message })
    }
  },

  async getByDistributor(req, res) {
    try {
      const farmers = await farmerService.getByDistributor(req.params.distributorId)
      res.json(farmers)
    } catch (err) {
      res.status(404).json({ error: err.message })
    }
  },

async create(req, res) {
  try {
    const payload = req.body
    console.log(payload)
    // If distributorId also comes as a URL param, use that as fallback
    if (req.params.distributorId && !payload.farmerDetails?.distributor_id) {
      payload.farmerDetails.distributor_id = req.params.distributorId
    }

    const farmer = await farmerService.create(payload)
    res.status(201).json(farmer)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
},

  async update(req, res) {
    try {
      const farmer = await farmerService.update(req.params.id, req.body)
      res.json(farmer)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async remove(req, res) {
    try {
      const result = await farmerService.remove(req.params.id)
      res.json(result)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },
}

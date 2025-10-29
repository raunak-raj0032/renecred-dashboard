import * as distributorService from '../services/distributorService.js'

// ===============================
// 🔹 Distributor Controllers
// ===============================
export const getAllDistributors = async (req, res) => {
  try {
    const distributors = await distributorService.getDistributors()
    res.json(distributors)
  } catch (error) {
    console.error('Error fetching distributors:', error)
    res.status(500).json({ error: 'Failed to fetch distributors' })
  }
}

export const getDistributor = async (req, res) => {
  try {
    const distributor = await distributorService.getDistributorById(req.params.id)
    if (!distributor) return res.status(404).json({ error: 'Distributor not found' })
    res.json(distributor)
  } catch (error) {
    console.error('Error fetching distributor:', error)
    res.status(500).json({ error: 'Failed to fetch distributor' })
  }
}

export const createDistributor = async (req, res) => {
  try {
    const newDistributor = await distributorService.createDistributor(req.body)
    res.status(201).json(newDistributor)
  } catch (error) {
    console.error('Error creating distributor:', error)
    res.status(500).json({ error: 'Failed to create distributor' })
  }
}

export const updateDistributor = async (req, res) => {
  try {
    const updated = await distributorService.updateDistributor(req.params.id, req.body)
    res.json(updated)
  } catch (error) {
    console.error('Error updating distributor:', error)
    res.status(500).json({ error: 'Failed to update distributor' })
  }
}

export const deleteDistributor = async (req, res) => {
  try {
    await distributorService.deleteDistributor(req.params.id)
    res.json({ message: 'Distributor deleted successfully' })
  } catch (error) {
    console.error('Error deleting distributor:', error)
    res.status(500).json({ error: 'Failed to delete distributor' })
  }
}

// ===============================
// 🔹 Farmer Controllers
// ===============================
export const addFarmerController = async (req, res) => {
  try {
    const { distributorId } = req.params
    const farmerData = req.body
    const newFarmer = await distributorService.addFarmer(distributorId, farmerData)
    res.status(201).json(newFarmer)
  } catch (error) {
    console.error('Error adding farmer:', error)
    res.status(500).json({ error: 'Failed to add farmer' })
  }
}

export const updateFarmerController = async (req, res) => {
  try {
    const { distributorId, farmerId } = req.params
    const updated = await distributorService.updateFarmer(distributorId, farmerId, req.body)
    res.json(updated)
  } catch (error) {
    console.error('Error updating farmer:', error)
    res.status(500).json({ error: 'Failed to update farmer' })
  }
}

export const deleteFarmerController = async (req, res) => {
  try {
    const { distributorId, farmerId } = req.params
    await distributorService.deleteFarmer(distributorId, farmerId)
    res.json({ message: 'Farmer deleted successfully' })
  } catch (error) {
    console.error('Error deleting farmer:', error)
    res.status(500).json({ error: 'Failed to delete farmer' })
  }
}


// ===============================
// 🔹 Cattle Controllers
// ===============================
export const getAllCattleController = async (req, res) => {
  try {
    const { farmerId } = req.params
    const cattle = await distributorService.getCattleByFarmer(farmerId)
    res.json(cattle)
  } catch (error) {
    console.error('Error fetching cattle:', error)
    res.status(500).json({ error: 'Failed to fetch cattle' })
  }
}

export const getCattleByIdController = async (req, res) => {
  try {
    const { cattleId } = req.params
    const cattle = await distributorService.getCattleById(cattleId)
    if (!cattle) return res.status(404).json({ error: 'Cattle not found' })
    res.json(cattle)
  } catch (error) {
    console.error('Error fetching cattle by ID:', error)
    res.status(500).json({ error: 'Failed to fetch cattle by ID' })
  }
}

export const addCattleController = async (req, res) => {
  try {
    const { farmerId } = req.params
    const cattleData = req.body
    const newCattle = await distributorService.addCattle(farmerId, cattleData)
    res.status(201).json(newCattle)
  } catch (error) {
    console.error('Error adding cattle:', error)
    res.status(500).json({ error: 'Failed to add cattle' })
  }
}

export const updateCattleController = async (req, res) => {
  try {
    const { farmerId, cattleId } = req.params
    const updated = await distributorService.updateCattle(farmerId, cattleId, req.body)
    res.json(updated)
  } catch (error) {
    console.error('Error updating cattle:', error)
    res.status(500).json({ error: 'Failed to update cattle' })
  }
}

export const deleteCattleController = async (req, res) => {
  try {
    const { farmerId, cattleId } = req.params
    await distributorService.deleteCattle(farmerId, cattleId)
    res.json({ message: 'Cattle deleted successfully' })
  } catch (error) {
    console.error('Error deleting cattle:', error)
    res.status(500).json({ error: 'Failed to delete cattle' })
  }
}

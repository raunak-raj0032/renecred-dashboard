import { supabase } from '../supabaseClient.js'

// --- GET ALL FARMERS ---
export const getAllFarmers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('farmers')
      .select('*')

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// --- GET FARMER BY ID ---
export const getFarmerById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('farmers')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Farmer not found' })
    }
    if (error) throw error

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// --- GET FARMERS BY DISTRIBUTOR ---
export const getFarmersByDistributor = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('farmers')
      .select('*')
      .eq('distributor_id', req.params.distributorId)

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// --- CREATE FARMER ---
export const createFarmer = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('farmers')
      .insert(req.body)
      .select()
      .single()

    if (error) throw error
    res.status(201).json(data)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// --- UPDATE FARMER ---
export const updateFarmer = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('farmers')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// --- DELETE FARMER ---
export const deleteFarmer = async (req, res) => {
  try {
    const { error } = await supabase
      .from('farmers')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ success: true, message: 'Farmer deleted successfully' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

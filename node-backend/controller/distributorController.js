import { supabase } from '../supabaseClient.js'

// --- GET ALL DISTRIBUTORS ---
export const getAllDistributors = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('distributors')
      .select('*')

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// --- GET DISTRIBUTOR BY ID ---
export const getDistributor = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('distributors')
      .select('*')
      .eq('distributor_id', req.params.id) // ✅ use distributor_id (your Supabase key)
      .single()

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Distributor not found' })
    }
    if (error) throw error

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// --- CREATE DISTRIBUTOR ---
export const createDistributor = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('distributors')
      .insert(req.body)
      .select()
      .single()

    if (error) throw error
    res.status(201).json(data)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// --- UPDATE DISTRIBUTOR ---
export const updateDistributor = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('distributors')
      .update(req.body)
      .eq('distributor_id', req.params.id)
      .select()
      .single()

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// --- DELETE DISTRIBUTOR ---
export const deleteDistributor = async (req, res) => {
  try {
    const { error } = await supabase
      .from('distributors')
      .delete()
      .eq('distributor_id', req.params.id)

    if (error) throw error
    res.json({ success: true, message: 'Distributor deleted successfully' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

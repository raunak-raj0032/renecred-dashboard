import { supabase } from '../supabaseClient.js'

// --- GET ALL CATTLE ---
export const getAllCattle = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cattle')
      .select('*')

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// --- GET CATTLE BY ID ---
export const getCattleById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cattle')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Cattle not found' })
    }
    if (error) throw error

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// --- CREATE CATTLE ---
export const createCattle = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cattle')
      .insert(req.body)
      .select()
      .single()

    if (error) throw error
    res.status(201).json(data)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// --- UPDATE CATTLE ---
export const updateCattle = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cattle')
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

// --- DELETE CATTLE ---
export const deleteCattle = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cattle')
      .delete()
      .eq('id', req.params.id)
      .select() // ensures it actually returns deleted rows

    if (error) throw error

    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: 'Cattle not found or already deleted' })
    }

    res.json({ success: true, message: 'Cattle deleted successfully' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

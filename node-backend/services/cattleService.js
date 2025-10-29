import { supabase } from '../supabaseClient.js'

export const cattleService = {
  // Get all cattle
  async getAll() {
    const { data, error } = await supabase.from('cattle').select('*')
    if (error) throw new Error(error.message)
    return data
  },

  // Get cattle by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('cattle')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  // Create new cattle record
  async create(cattle) {
    const { data, error } = await supabase
      .from('cattle')
      .insert([cattle])
      .select()
    if (error) throw new Error(error.message)
    return data[0]
  },

  // Update cattle record
  async update(id, updates) {
    const { data, error } = await supabase
      .from('cattle')
      .update(updates)
      .eq('id', id)
      .select()
    if (error) throw new Error(error.message)
    return data[0]
  },

  // Delete cattle record
  async remove(id) {
    const { error } = await supabase
      .from('cattle')
      .delete()
      .eq('id', id)
    if (error) throw new Error(error.message)
    return { message: 'Cattle deleted successfully' }
  },
}

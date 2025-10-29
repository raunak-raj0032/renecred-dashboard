import { supabase } from '../supabaseClient.js'

/* ===========================================================
   🔹 DISTRIBUTOR SERVICES
   =========================================================== */
export const getDistributors = async () => {
  const { data, error } = await supabase
    .from('distributors')
    .select(`
      id,
      name,
      registration_number,
      email,
      phone_number,
      address,
      city,
      state,
      pin_code,
      inwards (
        id, feed_concentrator, dispatch_id, total_quantity, used_quantity
      ),
      farmers (
        id,
        farmer_name,
        whatsapp_no,
        phone_no,
        email,
        address,
        state,
        city,
        pin_code,
        aadhar_no,
        total_cattle,
        cattle (
          id, cattle_id, age_range, weight_range, cattle_type
        )
      )
    `)

  if (error) throw new Error(error.message)
  return data
}

export const getDistributorById = async (id) => {
  const { data, error } = await supabase
    .from('distributors')
    .select(`
      id,
      name,
      registration_number,
      email,
      phone_number,
      address,
      city,
      state,
      pin_code,
      inwards (
        id, feed_concentrator, dispatch_id, total_quantity, used_quantity
      ),
      farmers (
        id,
        farmer_name,
        whatsapp_no,
        phone_no,
        email,
        address,
        state,
        city,
        pin_code,
        aadhar_no,
        total_cattle,
        cattle (
          id, cattle_id, age_range, weight_range, cattle_type
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const createDistributor = async (distributor) => {
  const { data, error } = await supabase
    .from('distributors')
    .insert([distributor])
    .select()

  if (error) throw new Error(error.message)
  return data[0]
}

export const updateDistributor = async (id, updates) => {
  const { data, error } = await supabase
    .from('distributors')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) throw new Error(error.message)
  return data[0]
}

export const deleteDistributor = async (id) => {
  const { data, error } = await supabase
    .from('distributors')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return data
}

/* ===========================================================
   🔹 FARMER SERVICES
   =========================================================== */
export const addFarmer = async (distributorId, farmerData) => {
  const { data, error } = await supabase
    .from('farmers')
    .insert([{ ...farmerData, distributor_id: distributorId }])
    .select()

  if (error) throw new Error(error.message)
  return data[0]
}

export const updateFarmer = async (distributorId, farmerId, updatedData) => {
  const { data, error } = await supabase
    .from('farmers')
    .update(updatedData)
    .eq('id', farmerId)
    .eq('distributor_id', distributorId)
    .select()

  if (error) throw new Error(error.message)
  return data[0]
}

export const deleteFarmer = async (distributorId, farmerId) => {
  const { data, error } = await supabase
    .from('farmers')
    .delete()
    .eq('id', farmerId)
    .eq('distributor_id', distributorId)

  if (error) throw new Error(error.message)
  return data
}

/* ===========================================================
   🔹 CATTLE SERVICES
   =========================================================== */

// ✅ Get all cattle for a given farmer
export const getCattleByFarmer = async (farmerId) => {
  const { data, error } = await supabase
    .from('cattle')
    .select('id, cattle_id, cattle_type, age_range, weight_range')
    .eq('farmer_id', farmerId)

  if (error) throw new Error(error.message)
  return data
}

// ✅ Get a single cattle by ID
export const getCattleById = async (cattleId) => {
  const { data, error } = await supabase
    .from('cattle')
    .select('id, farmer_id, cattle_id, cattle_type, age_range, weight_range')
    .eq('id', cattleId)
    .single()

  if (error) throw new Error(error.message)
  return data
}

// ✅ Add a new cattle for a farmer
export const addCattle = async (farmerId, cattleData) => {
  try {
    const { data, error } = await supabase
      .from('cattle')
      .insert([
        {
          farmer_id: farmerId,
          cattle_id: cattleData.cattle_id || randomUUID(),
          cattle_type: cattleData.cattle_type,
          age_range: cattleData.age_range,
          weight_range: cattleData.weight_range,
        },
      ])
      .select()

    if (error) {
      console.error('❌ Supabase insert error:', error)
      throw new Error(error.message || error.details)
    }

    return data[0]
  } catch (err) {
    console.error('❌ Error adding cattle:', err)
    throw err
  }
}

// ✅ Update a cattle record
export const updateCattle = async (farmerId, cattleId, updatedData) => {
  const { data, error } = await supabase
    .from('cattle')
    .update({
      cattle_id: updatedData.cattle_id,
      cattle_type: updatedData.cattle_type,
      age_range: updatedData.age_range,
      weight_range: updatedData.weight_range,
    })
    .eq('id', cattleId)
    .eq('farmer_id', farmerId)
    .select()

  if (error) throw new Error(error.message)
  return data[0]
}

// ✅ Delete a cattle record
export const deleteCattle = async (farmerId, cattleId) => {
  const { data, error } = await supabase
    .from('cattle')
    .delete()
    .eq('id', cattleId)
    .eq('farmer_id', farmerId)

  if (error) throw new Error(error.message)
  return data
}

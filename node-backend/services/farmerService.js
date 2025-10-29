import { supabase } from '../supabaseClient.js'

export const farmerService = {
  /* ---------------------- FETCH METHODS ---------------------- */

  async getAll() {
    const { data, error } = await supabase
      .from('farmers')
      .select(`
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
        distributor_id,
        cattle (
          id,
          cattle_id,
          age_range,
          weight_range,
          cattle_type
        )
      `)
    if (error) throw new Error(error.message)
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('farmers')
      .select(`
        *,
        cattle (
          id,
          cattle_id,
          age_range,
          weight_range,
          cattle_type
        )
      `)
      .eq('id', id)
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async getByDistributor(distributorId) {
    const { data, error } = await supabase
      .from('farmers')
      .select('*')
      .eq('distributor_id', distributorId)
    if (error) throw new Error(error.message)
    return data
  },

  /* ---------------------- CREATE (from frontend payload) ---------------------- */
  async createWithCattle(payload) {
    const f = payload.farmerDetails

    const farmerRow = {
      distributor_id: f.distributor_id,
      farmer_name: f.farmerName,
      whatsapp_no: f.whatsappNo,
      phone_no: f.phoneNo,
      email: f.email,
      address: f.address,
      state: f.state,
      city: f.city,
      pin_code: f.pinCode,
      aadhar_no: f.aadharNo,
      total_cattle: payload.cattleList?.length ?? 0,
    }

    const { data: farmerData, error: farmerError } = await supabase
      .from('farmers')
      .insert([farmerRow])
      .select()
      .single()

    if (farmerError) throw new Error(farmerError.message)
    const farmerId = farmerData.id

    if (payload.cattleList && payload.cattleList.length > 0) {
      const cattleRows = payload.cattleList.map((c) => ({
        farmer_id: farmerId,
        cattle_id: c.id,
        age_range: c.age,
        weight_range: c.weight,
        cattle_type: c.type,
      }))

      const { error: cattleError } = await supabase.from('cattle').insert(cattleRows)
      if (cattleError) throw new Error(cattleError.message)
    }

    return { ...farmerData, cattle: payload.cattleList }
  },

  /* ---------------------- SIMPLE CREATE ---------------------- */
async create(farmer) {
  const payload = {
    distributor_id: farmer.distributor_id,
    farmer_name: farmer.farmer_name,
    whatsapp_no: farmer.whatsapp_no,
    phone_no: farmer.phone_no,
    email: farmer.email,
    address: farmer.address,
    state: farmer.state,
    city: farmer.city,
    pin_code: farmer.pin_code,
    aadhar_no: farmer.aadhar_no,
    total_cattle: farmer.total_cattle ?? 0,
  }

  const { data, error } = await supabase.from('farmers').insert([payload]).select()
  if (error) throw new Error(error.message)
  return data?.[0]
},


  /* ---------------------- ADD FARMER (for Distributor Nested POST) ---------------------- */
  async addFarmer(distributorId, farmer) {
    // No validation — take frontend data as-is
    const payload = {
      distributor_id: distributorId,
      farmer_name: farmer.farmer_name,
      phone_no: farmer.phone_no,
      whatsapp_no: farmer.whatsapp_no,
      email: farmer.email,
      address: farmer.address,
      city: farmer.city,
      state: farmer.state,
      pin_code: farmer.pin_code,
      aadhar_no: farmer.aadhar_no,
      total_cattle: farmer.total_cattle ?? 0,
    }

    const { data, error } = await supabase.from('farmers').insert([payload]).select().single()
    if (error) throw new Error(error.message)
    return data
  },

  /* ---------------------- UPDATE ---------------------- */
  async update(id, updates) {
    const { data, error } = await supabase
      .from('farmers')
      .update(updates)
      .eq('id', id)
      .select()
    if (error) throw new Error(error.message)
    return data?.[0]
  },

  /* ---------------------- DELETE ---------------------- */
  async remove(id) {
    const { error } = await supabase.from('farmers').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return { message: 'Farmer deleted successfully' }
  },

  /* ---------------------- UPDATE FARMER (camelCase-safe) ---------------------- */
  async updateFarmer(farmerId, updates) {
    const payload = {}

    if (updates.farmerName) payload.farmer_name = updates.farmerName
    if (updates.whatsappNo) payload.whatsapp_no = updates.whatsappNo
    if (updates.phoneNo) payload.phone_no = updates.phoneNo
    if (updates.email) payload.email = updates.email
    if (updates.address) payload.address = updates.address
    if (updates.state) payload.state = updates.state
    if (updates.city) payload.city = updates.city
    if (updates.pinCode) payload.pin_code = updates.pinCode
    if (updates.aadharNo) payload.aadhar_no = updates.aadharNo
    if (updates.total_cattle !== undefined) payload.total_cattle = updates.total_cattle

    const { data, error } = await supabase
      .from('farmers')
      .update(payload)
      .eq('id', farmerId)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  },
}

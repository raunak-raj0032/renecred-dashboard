'use client'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/distributors'

// ==============================
// 🔹 Distributor CRUD
// ==============================

// GET all distributors
export const fetchDistributors = createAsyncThunk(
  'distributors/fetchAll',
  async () => {
    const { data } = await axios.get(API_URL)
    return data
  }
)

// GET one distributor by ID
export const fetchDistributorById = createAsyncThunk(
  'distributors/fetchById',
  async (id) => {
    const { data } = await axios.get(`${API_URL}/${id}`)
    return data
  }
)

// POST new distributor
export const createDistributor = createAsyncThunk(
  'distributors/create',
  async (payload) => {
    const { data } = await axios.post(API_URL, payload)
    return data
  }
)

// PUT update distributor
export const updateDistributor = createAsyncThunk(
  'distributors/update',
  async ({ id, updates }) => {
    const { data } = await axios.put(`${API_URL}/${id}`, updates)
    return data
  }
)

// DELETE distributor
export const deleteDistributor = createAsyncThunk(
  'distributors/delete',
  async (id) => {
    await axios.delete(`${API_URL}/${id}`)
    return id
  }
)

// ==============================
// 🔹 Farmer CRUD
// ==============================

// Create Farmer
export const createFarmer = createAsyncThunk(
  'farmers/create',
  async ({ distributorId, farmer }) => {
    const payload = { ...farmer, distributor_id: distributorId }
    const { data } = await axios.post(`${API_URL}/${distributorId}/farmers`, payload)
    return data
  }
)

// Update Farmer
export const updateFarmer = createAsyncThunk(
  'farmers/update',
  async ({ distributorId, farmerId, updates }) => {
    const { data } = await axios.put(
      `${API_URL}/${distributorId}/farmers/${farmerId}`,
      updates
    )
    return data
  }
)

// Delete Farmer
export const deleteFarmer = createAsyncThunk(
  'farmers/delete',
  async ({ distributorId, farmerId }) => {
    await axios.delete(`${API_URL}/${distributorId}/farmers/${farmerId}`)
    return farmerId
  }
)

// ==============================
// 🔹 Cattle CRUD
// ==============================

// ✅ Fetch all cattle under a farmer
export const fetchAllCattle = createAsyncThunk(
  'cattle/fetchAll',
  async ({ distributorId, farmerId }) => {
    const { data } = await axios.get(
      `${API_URL}/${distributorId}/farmers/${farmerId}/cattle`
    )
    return { farmerId, data }
  }
)

// ✅ Fetch one cattle by ID
export const fetchCattleById = createAsyncThunk(
  'cattle/fetchById',
  async ({ distributorId, farmerId, cattleId }) => {
    const { data } = await axios.get(
      `${API_URL}/${distributorId}/farmers/${farmerId}/cattle/${cattleId}`
    )
    return data
  }
)

// ✅ Create Cattle
export const createCattle = createAsyncThunk(
  'cattle/create',
  async ({ distributorId, farmerId, cattle }) => {
    const { data } = await axios.post(
      `${API_URL}/${distributorId}/farmers/${farmerId}/cattle`,
      cattle
    )
    return data
  }
)

// ✅ Update Cattle
export const updateCattle = createAsyncThunk(
  'cattle/update',
  async ({ distributorId, farmerId, cattleId, updates }) => {
    const { data } = await axios.put(
      `${API_URL}/${distributorId}/farmers/${farmerId}/cattle/${cattleId}`,
      updates
    )
    return data
  }
)

// ✅ Delete Cattle
export const deleteCattle = createAsyncThunk(
  'cattle/delete',
  async ({ distributorId, farmerId, cattleId }) => {
    await axios.delete(`${API_URL}/${distributorId}/farmers/${farmerId}/cattle/${cattleId}`)
    return { farmerId, cattleId }
  }
)

// ==============================
// 🔹 Slice
// ==============================

const initialState = {
  data: [],
  loading: false,
  error: null,
  selectedDistributor: null,
}

const distributorsSlice = createSlice({
  name: 'distributors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Fetch All ---
      .addCase(fetchDistributors.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchDistributors.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchDistributors.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch distributors'
      })

      // --- Fetch One ---
      .addCase(fetchDistributorById.fulfilled, (state, action) => {
        state.selectedDistributor = action.payload
      })

      // --- Distributor CRUD ---
      .addCase(createDistributor.fulfilled, (state, action) => {
        state.data.push(action.payload)
      })
      .addCase(updateDistributor.fulfilled, (state, action) => {
        const idx = state.data.findIndex((d) => d.id === action.payload.id)
        if (idx !== -1) state.data[idx] = action.payload
      })
      .addCase(deleteDistributor.fulfilled, (state, action) => {
        state.data = state.data.filter((d) => d.id !== action.payload)
      })

      // ==============================
      // 🔹 Farmer Reducers
      // ==============================
      .addCase(createFarmer.fulfilled, (state, action) => {
        const farmer = action.payload
        const dist = state.data.find((d) => d.id === farmer.distributor_id)
        if (dist) dist.farmers = [...(dist.farmers || []), farmer]
        if (state.selectedDistributor?.id === farmer.distributor_id)
          state.selectedDistributor.farmers = [
            ...(state.selectedDistributor.farmers || []),
            farmer,
          ]
      })
      .addCase(updateFarmer.fulfilled, (state, action) => {
        const farmer = action.payload
        const dist = state.data.find((d) => d.id === farmer.distributor_id)
        if (dist && dist.farmers) {
          const fIdx = dist.farmers.findIndex((f) => f.id === farmer.id)
          if (fIdx !== -1) dist.farmers[fIdx] = farmer
        }
        if (state.selectedDistributor?.id === farmer.distributor_id) {
          const fIdx = state.selectedDistributor.farmers?.findIndex(
            (f) => f.id === farmer.id
          )
          if (fIdx !== undefined && fIdx !== -1)
            state.selectedDistributor.farmers[fIdx] = farmer
        }
      })
      .addCase(deleteFarmer.fulfilled, (state, action) => {
        const farmerId = action.payload
        if (state.selectedDistributor) {
          state.selectedDistributor.farmers =
            state.selectedDistributor.farmers?.filter((f) => f.id !== farmerId) || []
        }
      })

      // ==============================
      // 🔹 Cattle Reducers
      // ==============================
      // --- Fetch all cattle ---
      .addCase(fetchAllCattle.fulfilled, (state, action) => {
        const { farmerId, data } = action.payload
        const farmer = state.selectedDistributor?.farmers?.find((f) => f.id === farmerId)
        if (farmer) farmer.cattle = data
      })

      // --- Fetch single cattle ---
      .addCase(fetchCattleById.fulfilled, (state, action) => {
        const cattle = action.payload
        const farmer = state.selectedDistributor?.farmers?.find(
          (f) => f.id === cattle.farmer_id
        )
        if (farmer) {
          const existing = farmer.cattle?.find((c) => c.id === cattle.id)
          if (!existing) farmer.cattle = [...(farmer.cattle || []), cattle]
        }
      })

      // --- Create ---
      .addCase(createCattle.fulfilled, (state, action) => {
        const cattle = action.payload
        const farmer = state.selectedDistributor?.farmers?.find(
          (f) => f.id === cattle.farmer_id
        )
        if (farmer) farmer.cattle = [...(farmer.cattle || []), cattle]
      })

      // --- Update ---
      .addCase(updateCattle.fulfilled, (state, action) => {
        const cattle = action.payload
        const farmer = state.selectedDistributor?.farmers?.find(
          (f) => f.id === cattle.farmer_id
        )
        if (farmer?.cattle) {
          const cIdx = farmer.cattle.findIndex((c) => c.id === cattle.id)
          if (cIdx !== -1) farmer.cattle[cIdx] = cattle
        }
      })

      // --- Delete ---
      .addCase(deleteCattle.fulfilled, (state, action) => {
        const { farmerId, cattleId } = action.payload
        const farmer = state.selectedDistributor?.farmers?.find((f) => f.id === farmerId)
        if (farmer)
          farmer.cattle = farmer.cattle?.filter((c) => c.id !== cattleId) || []
      })
  },
})

export default distributorsSlice.reducer

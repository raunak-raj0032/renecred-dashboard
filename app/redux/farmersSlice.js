'use client'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// ==============================
// 🔹 API Base
// ==============================
const API_URL = 'http://localhost:5000/api/farmers'

// ==============================
// 🔹 Async Thunks (CRUD)
// ==============================

// GET all farmers
export const fetchFarmers = createAsyncThunk('farmers/fetchAll', async () => {
  const { data } = await axios.get(API_URL)
  return data
})

// GET one farmer by ID
export const fetchFarmerById = createAsyncThunk('farmers/fetchById', async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`)
  return data
})

// GET all farmers under a distributor
export const fetchFarmersByDistributor = createAsyncThunk(
  'farmers/fetchByDistributor',
  async (distributorId) => {
    const { data } = await axios.get(`${API_URL}/distributor/${distributorId}`)
    return data
  }
)

// CREATE new farmer
export const createFarmer = createAsyncThunk(
  'farmers/create',
  async ({ distributorId, farmer }) => {
    const url = distributorId
      ? `${API_URL}/distributor/${distributorId}`
      : API_URL
    const { data } = await axios.post(url, farmer)
    return data
  }
)

// UPDATE farmer
export const updateFarmer = createAsyncThunk(
  'farmers/update',
  async ({ id, updates }) => {
    const { data } = await axios.put(`${API_URL}/${id}`, updates)
    return data
  }
)

// DELETE farmer
export const deleteFarmer = createAsyncThunk('farmers/delete', async (id) => {
  await axios.delete(`${API_URL}/${id}`)
  return id
})

// ==============================
// 🔹 Slice
// ==============================

const initialState = {
  data: [],
  loading: false,
  error: null,
  selectedFarmer: null,
}

const farmersSlice = createSlice({
  name: 'farmers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Fetch All ---
      .addCase(fetchFarmers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchFarmers.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchFarmers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch farmers'
      })

      // --- Fetch One ---
      .addCase(fetchFarmerById.fulfilled, (state, action) => {
        state.selectedFarmer = action.payload
      })

      // --- Fetch by Distributor ---
      .addCase(fetchFarmersByDistributor.fulfilled, (state, action) => {
        state.data = action.payload
      })

      // --- CRUD ---
      .addCase(createFarmer.fulfilled, (state, action) => {
        state.data.push(action.payload)
      })
      .addCase(updateFarmer.fulfilled, (state, action) => {
        const idx = state.data.findIndex((f) => f.id === action.payload.id)
        if (idx !== -1) state.data[idx] = action.payload
        if (state.selectedFarmer?.id === action.payload.id)
          state.selectedFarmer = action.payload
      })
      .addCase(deleteFarmer.fulfilled, (state, action) => {
        state.data = state.data.filter((f) => f.id !== action.payload)
        if (state.selectedFarmer?.id === action.payload)
          state.selectedFarmer = null
      })
  },
})

export default farmersSlice.reducer

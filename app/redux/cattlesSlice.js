'use client'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import API_BASE_URL from './apiconfig'

const API_URL = `${API_BASE_URL}/cattle`


// ==============================
// 🔹 Async Thunks (CRUD)
// ==============================

// ✅ Get all cattle
export const fetchCattle = createAsyncThunk('cattle/fetchAll', async () => {
  const { data } = await axios.get(API_URL)
  return data
})

// ✅ Get cattle by ID
export const fetchCattleById = createAsyncThunk('cattle/fetchById', async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`)
  return data
})

// ✅ Get all cattle under a specific farmer
export const fetchCattleByFarmer = createAsyncThunk(
  'cattle/fetchByFarmer',
  async (farmerId) => {
    const { data } = await axios.get(`${API_URL}/farmer/${farmerId}`)
    return data
  }
)

// ✅ Create new cattle record
export const createCattle = createAsyncThunk('cattle/create', async (cattle) => {
  const { data } = await axios.post(API_URL, cattle)
  return data
})

// ✅ Update existing cattle record
export const updateCattle = createAsyncThunk(
  'cattle/update',
  async ({ id, updates }) => {
    const { data } = await axios.put(`${API_URL}/${id}`, updates)
    return data
  }
)

// ✅ Delete cattle record
export const deleteCattle = createAsyncThunk('cattle/delete', async (id) => {
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
  selectedCattle: null,
}

const cattlesSlice = createSlice({
  name: 'cattle',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Fetch All ---
      .addCase(fetchCattle.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCattle.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchCattle.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch cattle'
      })

      // --- Fetch One ---
      .addCase(fetchCattleById.fulfilled, (state, action) => {
        state.selectedCattle = action.payload
      })

      // --- Fetch by Farmer ---
      .addCase(fetchCattleByFarmer.fulfilled, (state, action) => {
        state.data = action.payload
      })

      // --- Create ---
      .addCase(createCattle.fulfilled, (state, action) => {
        state.data.push(action.payload)
      })

      // --- Update ---
      .addCase(updateCattle.fulfilled, (state, action) => {
        const idx = state.data.findIndex((c) => c.id === action.payload.id)
        if (idx !== -1) state.data[idx] = action.payload
        if (state.selectedCattle?.id === action.payload.id)
          state.selectedCattle = action.payload
      })

      // --- Delete ---
      .addCase(deleteCattle.fulfilled, (state, action) => {
        state.data = state.data.filter((c) => c.id !== action.payload)
        if (state.selectedCattle?.id === action.payload)
          state.selectedCattle = null
      })
  },
})

export default cattlesSlice.reducer

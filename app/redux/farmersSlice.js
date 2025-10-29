'use client'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// ==============================
// 🔹 API Base URL
// ==============================
const API_URL = 'http://localhost:5000/api/farmers'

// ==============================
// 🔹 Async Thunks (CRUD)
// ==============================

// GET all farmers
export const fetchFarmers = createAsyncThunk('farmers/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(API_URL)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch farmers')
  }
})

// GET one farmer by ID
export const fetchFarmerById = createAsyncThunk('farmers/fetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/${id}`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch farmer')
  }
})

// GET all farmers under a specific distributor
export const fetchFarmersByDistributor = createAsyncThunk(
  'farmers/fetchByDistributor',
  async (distributorId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/distributor/${distributorId}`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch farmers by distributor')
    }
  }
)

// CREATE a new farmer
export const createFarmer = createAsyncThunk(
  'farmers/create',
  async (farmerData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(API_URL, farmerData)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create farmer')
    }
  }
)

// UPDATE existing farmer
export const updateFarmer = createAsyncThunk(
  'farmers/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/${id}`, updates)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update farmer')
    }
  }
)


// DELETE farmer
export const deleteFarmer = createAsyncThunk('farmers/delete', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to delete farmer')
  }
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
  reducers: {
    clearSelectedFarmer: (state) => {
      state.selectedFarmer = null
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch All ---
      .addCase(fetchFarmers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFarmers.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchFarmers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // --- Fetch by ID ---
      .addCase(fetchFarmerById.fulfilled, (state, action) => {
        state.selectedFarmer = action.payload
      })
      .addCase(fetchFarmerById.rejected, (state, action) => {
        state.error = action.payload
      })

      // --- Fetch by Distributor ---
      .addCase(fetchFarmersByDistributor.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchFarmersByDistributor.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchFarmersByDistributor.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // --- Create ---
      .addCase(createFarmer.fulfilled, (state, action) => {
        state.data.push(action.payload)
      })
      .addCase(createFarmer.rejected, (state, action) => {
        state.error = action.payload
      })

      // --- Update ---
      .addCase(updateFarmer.fulfilled, (state, action) => {
        const idx = state.data.findIndex((f) => f.id === action.payload.id)
        if (idx !== -1) state.data[idx] = action.payload
        if (state.selectedFarmer?.id === action.payload.id)
          state.selectedFarmer = action.payload
      })
      .addCase(updateFarmer.rejected, (state, action) => {
        state.error = action.payload
      })

      // --- Delete ---
      .addCase(deleteFarmer.fulfilled, (state, action) => {
        state.data = state.data.filter((f) => f.id !== action.payload)
        if (state.selectedFarmer?.id === action.payload)
          state.selectedFarmer = null
      })
      .addCase(deleteFarmer.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearSelectedFarmer } = farmersSlice.actions
export default farmersSlice.reducer

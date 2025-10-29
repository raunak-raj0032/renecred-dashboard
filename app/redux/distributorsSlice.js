'use client'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import API_BASE_URL from './apiconfig'
// ==============================
// 🔹 API URLs
// ==============================
const DISTRIBUTORS_URL = `${API_BASE_URL}/distributors`
const FARMERS_URL = `${API_BASE_URL}/farmers`
const CATTLE_URL = `${API_BASE_URL}/cattle`

// ==============================
// 🔹 Distributor CRUD
// ==============================
export const fetchDistributors = createAsyncThunk('distributors/fetchAll', async () => {
  const { data } = await axios.get(DISTRIBUTORS_URL)
  return data
})

export const fetchDistributorById = createAsyncThunk('distributors/fetchById', async (id) => {
  const { data } = await axios.get(`${DISTRIBUTORS_URL}/${id}`)
  return data
})

export const createDistributor = createAsyncThunk('distributors/create', async (payload) => {
  const { data } = await axios.post(DISTRIBUTORS_URL, payload)
  return data
})

// ✅ Replace your current updateDistributor with this:
export const updateDistributor = createAsyncThunk(
  'distributors/update',
  async (payload) => {
    const { id, ...updates } = payload
    const { data } = await axios.put(`${DISTRIBUTORS_URL}/${id}`, updates)
    return data
  }
)


export const deleteDistributor = createAsyncThunk('distributors/delete', async (id) => {
  await axios.delete(`${DISTRIBUTORS_URL}/${id}`)
  return id
})

// ==============================
// 🔹 Farmer CRUD (Direct API)
// ==============================
export const fetchFarmers = createAsyncThunk('farmers/fetchAll', async () => {
  const { data } = await axios.get(FARMERS_URL)
  return data
})

export const fetchFarmerById = createAsyncThunk('farmers/fetchById', async (id) => {
  const { data } = await axios.get(`${FARMERS_URL}/${id}`)
  return data
})

export const createFarmer = createAsyncThunk('farmers/create', async (farmer) => {
  const { data } = await axios.post(FARMERS_URL, farmer)
  return data
})

export const updateFarmer = createAsyncThunk('farmers/update', async ({ id, updates }) => {
  const { data } = await axios.put(`${FARMERS_URL}/${id}`, updates)
  return data
})

export const deleteFarmer = createAsyncThunk('farmers/delete', async (id) => {
  await axios.delete(`${FARMERS_URL}/${id}`)
  return id
})

// ==============================
// 🔹 Cattle CRUD (Direct API)
// ==============================
export const fetchCattle = createAsyncThunk('cattle/fetchAll', async () => {
  const { data } = await axios.get(CATTLE_URL)
  return data
})

export const fetchCattleById = createAsyncThunk('cattle/fetchById', async (id) => {
  const { data } = await axios.get(`${CATTLE_URL}/${id}`)
  return data
})

export const createCattle = createAsyncThunk('cattle/create', async (cattle) => {
  const { data } = await axios.post(CATTLE_URL, cattle)
  return data
})

export const updateCattle = createAsyncThunk('cattle/update', async ({ id, updates }) => {
  const { data } = await axios.put(`${CATTLE_URL}/${id}`, updates)
  return data
})

export const deleteCattle = createAsyncThunk('cattle/delete', async (id) => {
  await axios.delete(`${CATTLE_URL}/${id}`)
  return id
})

// ==============================
// 🔹 Slice
// ==============================
const initialState = {
  distributors: [],
  farmers: [],
  cattle: [],
  selectedDistributor: null,
  selectedFarmer: null,
  selectedCattle: null,
  loading: false,
  error: null,
}

const distributorsSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    clearSelected: (state) => {
      state.selectedDistributor = null
      state.selectedFarmer = null
      state.selectedCattle = null
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Distributor CRUD ---
      .addCase(fetchDistributors.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchDistributors.fulfilled, (state, action) => {
        state.loading = false
        state.distributors = action.payload
      })
      .addCase(fetchDistributors.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(createDistributor.fulfilled, (state, action) => {
        state.distributors.push(action.payload)
      })
      .addCase(updateDistributor.fulfilled, (state, action) => {
        const idx = state.distributors.findIndex((d) => d.id === action.payload.id)
        if (idx !== -1) state.distributors[idx] = action.payload
      })
      .addCase(deleteDistributor.fulfilled, (state, action) => {
        state.distributors = state.distributors.filter((d) => d.id !== action.payload)
      })
      .addCase(fetchDistributorById.fulfilled, (state, action) => {
        state.selectedDistributor = action.payload
      })

      // --- Farmer CRUD ---
      .addCase(fetchFarmers.fulfilled, (state, action) => {
        state.farmers = action.payload
      })
      .addCase(fetchFarmerById.fulfilled, (state, action) => {
        state.selectedFarmer = action.payload
      })
      .addCase(createFarmer.fulfilled, (state, action) => {
        state.farmers.push(action.payload)
      })
      .addCase(updateFarmer.fulfilled, (state, action) => {
        const idx = state.farmers.findIndex((f) => f.id === action.payload.id)
        if (idx !== -1) state.farmers[idx] = action.payload
      })
      .addCase(deleteFarmer.fulfilled, (state, action) => {
        state.farmers = state.farmers.filter((f) => f.id !== action.payload)
      })

      // --- Cattle CRUD ---
      .addCase(fetchCattle.fulfilled, (state, action) => {
        state.cattle = action.payload
      })
      .addCase(fetchCattleById.fulfilled, (state, action) => {
        state.selectedCattle = action.payload
      })
      .addCase(createCattle.fulfilled, (state, action) => {
        state.cattle.push(action.payload)
      })
      .addCase(updateCattle.fulfilled, (state, action) => {
        const idx = state.cattle.findIndex((c) => c.id === action.payload.id)
        if (idx !== -1) state.cattle[idx] = action.payload
      })
      .addCase(deleteCattle.fulfilled, (state, action) => {
        state.cattle = state.cattle.filter((c) => c.id !== action.payload)
      })
  },
})

export const { clearSelected } = distributorsSlice.actions
export default distributorsSlice.reducer

'use client'

import { configureStore } from '@reduxjs/toolkit'
import distributorsReducer from './distributorsSlice'
import farmersReducer from './farmersSlice'
import cattlesReducer from './cattlesSlice' // ✅ added cattle slice

export const store = configureStore({
  reducer: {
    distributors: distributorsReducer,
    farmers: farmersReducer,
    cattle: cattlesReducer, // ✅ register cattle slice
  },
})

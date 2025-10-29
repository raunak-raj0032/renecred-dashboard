'use client'

import { configureStore } from '@reduxjs/toolkit'
import distributorsReducer from './distributorsSlice'
import farmersReducer from './farmersSlice'

export const store = configureStore({
  reducer: {
    distributors: distributorsReducer,
    farmers: farmersReducer,
  },
})

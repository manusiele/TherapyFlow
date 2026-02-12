import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Farmer {
  id: string
  name: string
  email: string
  location: string
}

interface FarmerState {
  currentFarmer: Farmer | null
  loading: boolean
}

const initialState: FarmerState = {
  currentFarmer: null,
  loading: false,
}

const farmerSlice = createSlice({
  name: 'farmer',
  initialState,
  reducers: {
    setFarmer: (state, action: PayloadAction<Farmer>) => {
      state.currentFarmer = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setFarmer, setLoading } = farmerSlice.actions
export default farmerSlice.reducer

// eslint-disable-next-line import/no-extraneous-dependencies
import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
  name: 'data',
  initialState: {},
  reducers: {
    updateData(state, action) {
      return { ...state, ...action.payload };
    },
  },
});
export const { updateData } = dataSlice.actions;
export default dataSlice.reducer;

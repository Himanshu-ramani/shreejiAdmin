// eslint-disable-next-line import/no-extraneous-dependencies
import { configureStore } from '@reduxjs/toolkit';

import dataSlice from 'src/redux/slice/dataSlice';

export const store = configureStore({
  reducer: {
    data: dataSlice,
  },
});

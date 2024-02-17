import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

type ToolOptions = {
  color: string;
  size: string;
};

type InitialState = {
  username: string;
  tool: ToolOptions;
};

const initialState: InitialState = {
  username: '',
  tool: {
    color: '#ffffff',
    size: '',
  },
};

const paintSlice = createSlice({
  name: 'paint',
  initialState,
  reducers: {
    setUsername: (state, { payload }: PayloadAction<string>) => {
      state.username = payload;
    },
    setToolConfig: (
      state,
      {
        payload: { property, value },
      }: PayloadAction<{ property: keyof ToolOptions; value: string }>
    ) => {
      state.tool[property] = value;
    },
  },
});

export default paintSlice.reducer;
export const { setUsername } = paintSlice.actions;
export const paintSelector = (state: RootState) => state.paint;

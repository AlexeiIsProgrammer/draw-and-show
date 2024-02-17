import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

type ToolOptions = {
  name: 'brush' | 'eraser' | 'rect' | 'circle' | 'text';
  color: string;
  size: number;
};

type InitialState = {
  username: string;
  tool: ToolOptions;
};

const initialState: InitialState = {
  username: '',
  tool: {
    name: 'brush',
    color: '#ffffff',
    size: 2,
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
      }: PayloadAction<{ property: keyof ToolOptions; value: string | number }>
    ) => {
      state.tool[property] = value;
    },
    setTool: (state, { payload }: PayloadAction<ToolOptions>) => {
      state.tool = payload;
    },
  },
});

export default paintSlice.reducer;
export const { setUsername, setToolConfig, setTool } = paintSlice.actions;
export const paintSelector = (state: RootState) => state.paint;

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

type ToolOptions = {
  name: 'brush' | 'eraser' | 'rect' | 'circle' | 'text';
  color: string;
};

type InitialState = {
  username: string;
  tool: ToolOptions;
  image: string;
  isNotifyShowing: { name: string; isNotify: boolean };
};

const initialState: InitialState = {
  username: '',
  tool: {
    name: 'brush',
    color: '#fff',
  },
  image: '',
  isNotifyShowing: { name: '', isNotify: false },
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
      { payload: { property, value } }: PayloadAction<{ property: 'color'; value: string }>
    ) => {
      state.tool[property] = value;
    },
    setTool: (state, { payload }: PayloadAction<ToolOptions>) => {
      state.tool = payload;
    },
    setImage: (state, { payload }: PayloadAction<string>) => {
      state.image = payload;
    },
    setIsNotifyShowing: (state, { payload }: PayloadAction<string>) => {
      state.isNotifyShowing = { name: payload, isNotify: true };
    },
    closeNotifyShowing: (state) => {
      state.isNotifyShowing = { name: '', isNotify: false };
    },
  },
});

export default paintSlice.reducer;
export const {
  setUsername,
  setToolConfig,
  setTool,
  setImage,
  setIsNotifyShowing,
  closeNotifyShowing,
} = paintSlice.actions;
export const paintSelector = (state: RootState) => state.paint;

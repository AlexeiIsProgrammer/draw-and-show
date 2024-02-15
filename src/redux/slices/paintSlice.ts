import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import Tool from '@/tools/Tool';

type InitialState = {
  canvas: HTMLCanvasElement | null;
  tool: Tool | null;
};

const initialState: InitialState = {
  canvas: null,
  tool: null,
};

const paintSlice = createSlice({
  name: 'paint',
  initialState,
  reducers: {
    setCanvas: (state, { payload }: PayloadAction<HTMLCanvasElement>) => {
      state.canvas = payload;
    },
    setTool: (state, { payload }: PayloadAction<Tool>) => {
      state.tool = payload;
    },
    setToolColor: (state, { payload }: PayloadAction<string>) => {
      if (state.tool?.ctx) {
        state.tool.ctx.strokeStyle = payload;
        state.tool.ctx.fillStyle = payload;
      }
    },
  },
});

export default paintSlice.reducer;
export const { setCanvas, setTool, setToolColor } = paintSlice.actions;
export const paintSelector = (state: RootState) => state.paint;

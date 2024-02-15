import React, { useEffect, useRef } from 'react';
import styles from './DrawCanvas.module.scss';
import { useAppDispatch } from '@/redux';
import { setCanvas, setTool } from '@/redux/slices/paintSlice';
import Brush from '@/tools/Brush';

function DrawCanvas() {
  const dispatch = useAppDispatch();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      dispatch(setCanvas(canvasRef.current));
      dispatch(setTool(new Brush(canvasRef.current)));
    }
  }, []);

  return <canvas height={700} width={1200} ref={canvasRef} className={styles.canvas} />;
}

export default DrawCanvas;

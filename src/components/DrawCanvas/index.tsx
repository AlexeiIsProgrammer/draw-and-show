import { Layer, Line, Stage } from 'react-konva';
import { Socket, io } from 'socket.io-client';

import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/redux';
import { paintSelector } from '@/redux/slices/paintSlice';

interface Point {
  x: number;
  y: number;
}

interface DrawingData {
  lines: { id: string; points: Point[] }[];
}

function DrawCanvas() {
  const { username, tool } = useAppSelector(paintSelector);

  const stageRef = useRef<any>(null);
  const [lines, setLines] = useState<{ id: string; points: Point[] }[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [scale, setScale] = useState(1);
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [ctrlPressed, setCtrlPressed] = useState<boolean>(false);
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [prevPointerPos, setPrevPointerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:4000');
    socketRef.current.on('drawingData', (data: DrawingData) => {
      setLines(data.lines);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseDown && ctrlPressed) {
        const stage = stageRef.current;
        const pos = stage.getPointerPosition();
        const newPos = {
          x: stage.x() + (pos.x - prevPointerPos.x) / scale,
          y: stage.y() + (pos.y - prevPointerPos.y) / scale,
        };
        stage.position(newPos);
        stage.batchDraw();
        setPrevPointerPos({ x: pos.x, y: pos.y });
      }
    };

    const handleMouseUp = () => {
      setMouseDown(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseDown, ctrlPressed, prevPointerPos, scale]);

  const handleMouseDown = (e: any) => {
    if (e.evt.ctrlKey) {
      setCtrlPressed(true);
      setMouseDown(true);
      const stage = stageRef.current;
      const pos = stage.getPointerPosition();
      setPrevPointerPos({ x: pos.x, y: pos.y });
    } else {
      setIsDrawing(true);
      const id = Date.now().toString();
      const stage = stageRef.current;
      const point = stage.getPointerPosition();

      if (point) {
        const scaledPoint = {
          x: point.x / scale,
          y: point.y / scale,
        };
        console.log(stage.getPointerPosition());
        setLines([...lines, { id, points: [scaledPoint] }]);
      }
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return;

    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    if (point) {
      const updatedLines = lines.slice();
      const lastLine = updatedLines[updatedLines.length - 1];
      const scaledPoint = {
        x: point.x / scale,
        y: point.y / scale,
      };
      lastLine.points = [...lastLine.points, scaledPoint];
      setLines(updatedLines);
      socketRef.current?.emit('drawing', { lines: updatedLines });
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setCtrlPressed(false);
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    const newScale = e.evt.deltaY > 0 ? oldScale * 1.2 : oldScale / 1.2;

    setScale(newScale);

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  };

  return (
    <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onWheel={handleWheel}
        scaleX={scale}
        scaleY={scale}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        ref={stageRef}
      >
        <Layer>
          {lines.map((line) => (
            <Line
              key={line.id}
              points={line.points.flatMap((point) => [point.x * scale, point.y * scale])}
              stroke="#ffffff"
              strokeWidth={strokeWidth / scale}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default DrawCanvas;

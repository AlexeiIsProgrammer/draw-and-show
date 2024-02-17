import { Circle, Layer, Line, Rect, Stage } from 'react-konva';
import { Socket, io } from 'socket.io-client';
import { useNavigate, useParams } from 'react-router-dom';

import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux';
import { paintSelector, setImage, setIsNotifyShowing } from '@/redux/slices/paintSlice';
import { CircleType, LineType, RectangleType } from './types/types';

interface DrawingData {
  id: string;
  shapes: (LineType | RectangleType | CircleType)[];
}

function DrawCanvas() {
  const { id: boardId } = useParams();
  const { username, tool } = useAppSelector(paintSelector);
  const dispatch = useAppDispatch();
  const stageRef = useRef<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();

  const [shapes, setShapes] = useState<(LineType | RectangleType | CircleType)[]>([]);

  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [canvasPosition, setCanvasPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [scale, setScale] = useState(1);
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BASE_URL);

    socketRef.current.emit('joinBoard', boardId, username);
    socketRef.current
      .on('drawingData', (data: DrawingData) => {
        setShapes(data.shapes);
      })
      .on('error', () => {
        navigate('/boards');
      })
      .on('userJoined', (name: string) => {
        dispatch(setIsNotifyShowing(name));
      });

    return () => {
      const base64Board = stageRef.current?.toDataURL();
      if (base64Board) {
        dispatch(setImage(base64Board));
        socketRef.current?.emit('saveBoard', { boardId, base64Board });
      }
      socketRef.current?.disconnect();
    };
  }, []);

  const handleMouseDown = (e) => {
    if (e.evt.ctrlKey && e.evt.button === 0) {
      setIsMoving(true);
      setStartPosition({ x: e.evt.clientX, y: e.evt.clientY });
    } else {
      setIsDrawing(true);
      const id = Date.now().toString();
      const stage = stageRef.current;
      const point = stage.getPointerPosition();

      if (point) {
        const scaledPoint = {
          x: (point.x - canvasPosition.x) / scale,
          y: (point.y - canvasPosition.y) / scale,
        };

        switch (tool.name) {
          case 'brush':
            setShapes([
              ...shapes,
              {
                id,
                strokeWidth: 2,
                color: tool.color,
                points: [scaledPoint],
              },
            ]);
            break;
          case 'eraser':
            setShapes([
              ...shapes,
              {
                id,
                strokeWidth: 50,
                color: '#242424',
                points: [scaledPoint],
              },
            ]);
            break;
          case 'rect':
            const newRect: RectangleType = {
              id,
              color: tool.color,
              x: scaledPoint.x,
              y: scaledPoint.y,
              width: 0,
              height: 0,
            };
            setShapes([...shapes, newRect]);
            break;
          case 'circle':
            const newCircle: CircleType = {
              id,
              color: tool.color,
              x: scaledPoint.x,
              y: scaledPoint.y,
              radius: 0,
            };
            setShapes([...shapes, newCircle]);
            break;

          default:
            break;
        }
      }
    }
  };

  const handleMouseMove = (e) => {
    if (isMoving) {
      const deltaX = e.evt.clientX - startPosition.x;
      const deltaY = e.evt.clientY - startPosition.y;
      setCanvasPosition({
        x: canvasPosition.x + deltaX / scale,
        y: canvasPosition.y + deltaY / scale,
      });
      setStartPosition({ x: e.evt.clientX, y: e.evt.clientY });
    } else if (isDrawing) {
      const stage = stageRef.current;
      const point = stage.getPointerPosition();

      if (point) {
        const scaledPoint = {
          x: (point.x - canvasPosition.x) / scale,
          y: (point.y - canvasPosition.y) / scale,
        };

        const updatedShapes = shapes.slice();

        switch (tool.name) {
          case 'brush':
            const lastLine: LineType = updatedShapes[updatedShapes.length - 1] as LineType;

            lastLine.points = [...lastLine.points, scaledPoint];
            setShapes(updatedShapes);
            break;
          case 'eraser':
            const lastEraserLine: LineType = updatedShapes[updatedShapes.length - 1] as LineType;
            lastEraserLine.points.push(scaledPoint);

            setShapes(updatedShapes);
            break;
          case 'rect':
            const lastRectangle: RectangleType = updatedShapes[
              updatedShapes.length - 1
            ] as RectangleType;
            lastRectangle.width = scaledPoint.x - lastRectangle.x;
            lastRectangle.height = scaledPoint.y - lastRectangle.y;

            setShapes(updatedShapes);
            break;
          case 'circle':
            const lastCircle: CircleType = updatedShapes[updatedShapes.length - 1] as CircleType;

            lastCircle.radius = Math.sqrt(
              (point.x - lastCircle.x) ** 2 + (point.y - lastCircle.y) ** 2
            );

            setShapes(updatedShapes);
            break;
          default:
            break;
        }

        const image = stage.toDataURL();
        socketRef.current?.emit('drawing', { boardId, shapes: updatedShapes, image });
      }
    }
  };

  const handleMouseUp = (e) => {
    setIsDrawing(false);
    setIsMoving(false);
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: pointer.x / oldScale - stage.attrs.x / oldScale,
      y: pointer.y / oldScale - stage.attrs.y / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * 1.2 : oldScale / 1.2;

    setScale(newScale);

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: -(mousePointTo.x - pointer.x / newScale) * newScale,
      y: -(mousePointTo.y - pointer.y / newScale) * newScale,
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
        x={canvasPosition.x}
        y={canvasPosition.y}
      >
        <Layer>
          {shapes.map((shape) => {
            switch (true) {
              case 'points' in shape:
                return (
                  <Line
                    key={shape.id}
                    points={shape.points.flatMap((point) => [point.x * scale, point.y * scale])}
                    stroke={shape.color}
                    tension={0.5}
                    strokeWidth={shape.strokeWidth}
                    lineCap="round"
                    globalCompositeOperation="source-over"
                  />
                );
              case 'radius' in shape:
                return (
                  <Circle
                    key={shape.id}
                    x={shape.x * scale}
                    y={shape.y * scale}
                    radius={shape.radius * scale}
                    stroke={shape.color}
                    strokeWidth={2}
                  />
                );

              case 'width' in shape:
                return (
                  <Rect
                    key={shape.id}
                    x={shape.x * scale}
                    y={shape.y * scale}
                    width={shape.width * scale}
                    height={shape.height * scale}
                    stroke={shape.color}
                  />
                );

              default:
                return null;
            }
          })}
        </Layer>
      </Stage>
    </div>
  );
}

export default DrawCanvas;

interface Point {
  x: number;
  y: number;
}

export type LineType = { id: string; strokeWidth: number; color: string; points: Point[] };

export type RectangleType = {
  id: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CircleType = {
  id: string;
  color: string;
  x: number;
  y: number;
  radius: number;
};

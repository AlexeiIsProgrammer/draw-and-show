import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import {CircleType, LineType, RectangleType} from "./types";
import {config} from "dotenv";

config();

const PORT = process.env.PORT || 4000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.REACT_APP_FRONTEND_URL || ""],
  },
});

interface DrawingData {
  boardId: string;
  image: string;
  shapes: (LineType | RectangleType | CircleType)[];
}

let drawingData: DrawingData[] = [];

const createNewBoard = (boardId: string) => {
  const newBoard = {
    boardId,
    image: "",
    shapes: [],
  };

  drawingData.push(newBoard);

  return newBoard;
};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.emit(
    "boardsData",
    drawingData.map(({boardId, image}) => ({boardId, image}))
  );

  socket.on("joinBoard", (boardId: string, username: string) => {
    const currentBoard = drawingData.find((board) => board.boardId === boardId);
    if (currentBoard) {
      socket.broadcast.emit("userJoined", username);
      socket.emit("drawingData", currentBoard);
    } else {
      socket.emit("error", "Doesn't exists");
    }
  });

  socket.on("boardsData", (boardId: string) => {
    socket.emit("drawingData", createNewBoard(boardId));
  });

  socket.on("saveBoard", ({boardId, image}: Omit<DrawingData, "shapes">) => {
    const currentBoard = drawingData.find((board) => board.boardId === boardId);
    if (currentBoard) {
      currentBoard.image = image;
      socket.broadcast.emit(
        "boardsData",
        drawingData.map(({boardId, image}) => ({boardId, image}))
      );
    }
  });

  socket.on("drawing", ({boardId, shapes, image}: DrawingData) => {
    const currentBoard = drawingData.find((board) => board.boardId === boardId);
    if (currentBoard) {
      currentBoard.image = image;
      currentBoard.shapes = shapes;

      socket.broadcast.emit("drawingData", currentBoard);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

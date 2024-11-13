import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

// Add CORS options when creating the Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow any origin (not recommended for production)
    methods: ["GET", "POST"], // Allowed methods
  },
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (msg) => {
    console.log("Received message:", msg);
    socket.broadcast.emit(msg);
  });
});

io.on("message", (socket) => {
  socket.emit("hello", "world");
});

// server-side
io.on("connection", (socket) => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});


io.on("connect", () => {
  console.log("Connected to server!");

  // Emit "custom-message" event to the server
  io.emit("custom-message", "Hello from client!");
});

// Start the server on port 3000
httpServer.listen(3000, "0.0.0.0", () => {
  console.log("WebSocket server running on http://localhost:3000");
});

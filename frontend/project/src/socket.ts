import { io } from "socket.io-client";

// Adjust this URL to match your backend
const API_URL = import.meta.env.VITE_API_URL;

const socket = io(API_URL, {
  transports: ["websocket"],
});

export default socket;
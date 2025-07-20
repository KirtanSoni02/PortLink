import { io } from "socket.io-client";

// Adjust this URL to match your backend
const socket = io("http://localhost:3000");

export default socket;
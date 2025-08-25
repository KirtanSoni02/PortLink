import { io } from "socket.io-client";

// Adjust this URL to match your backend
const socket = io("https://portlink-ml31.onrender.com");

export default socket;
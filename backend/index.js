const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const user = new Map();
const home = require("./route/main.js");

const app = express();
const server = http.createServer(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());

app.use("/", home);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
    }
});

const parser = cookieParser();
io.use((socket, next) => {
    parser(socket.request, {}, (err) => {
        if (err) return next(err);

        console.log("Cookies:", socket.request.cookies);

        next();
    });
});

io.on("connection", (socket) => {
    console.log("The auth at the backend is : " , socket.handshake.auth);
    user.set(socket.handshake.auth.email , socket.id);
    console.log("Client Connected:", socket.id);
    console.log("The users are : " , user);
    
    // Parsed cookies
    console.log(socket.request.cookies);

    // Example:
    const token = socket.request.cookies.accessToken;
    console.log(token);

    socket.on("send-message", (data) => {
        console.log(data);
        const socketNumber = user.get(data.to);
        console.log("The socket number is : " , socketNumber);
        if(!socketNumber) {
            console.log("User not found");
            return;
        }
        io.to(socketNumber).emit("receive-message", {
            from: socket.handshake.auth.email,
            message: data.message
        });
    });

    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
    });

});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
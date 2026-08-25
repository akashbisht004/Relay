import {WebSocketServer} from 'ws';

const ws=new WebSocketServer({port: 3000});

console.log("Websocket server running on port 3000");

ws.on("connection",(socket)=>{
    console.log("client connected");
    socket.on("message", (message)=>{
        console.log("Received: ", message.toString());
        socket.send("hello");
    });

    socket.on("close", ()=>{
        console.log("client disconnected");
    })

});
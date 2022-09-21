// express 
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// socket.io (config)
const { Server: HTTPServer } = require("http")
const { Server: SocketServer } = require("socket.io")
const HttpServer = new HTTPServer(app)
const io = new SocketServer(HttpServer)

// static files
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// template engines
app.set("views","./views")
app.set("view engine","ejs")

// routers
const productos = require("./routers/productos")
app.use("/api/productos", productos.routes)

// let producto={
//     arrProductos: [ { title: '123', price: '123', thumbnail: '123', id: 1 } ]
// }

// console.log(`producto`,producto)
// console.log(`{arrProductos:productos.array}`,{arrProductos:productos.array})

app.get("/", (req, res)=>{
    res.render(`./index`, {arrProductos:productos.array})
})

// socket events
const Mensajes = [];

io.on('connection', (socket)=>{
    console.log(`Cliente conectado a ${socket}`)

    // chat
    socket.emit("mensajes", Mensajes);
    socket.on("new_msg", (data) => {
        const currDate = new Date()
        data.date= `${currDate.toLocaleString()}`
        Mensajes.push(data);
        io.sockets.emit("mensajes", Mensajes);
    });

    // prod
    socket.emit("productos", productos.array);
    socket.on("new_prod", (data) => {
        data.id = (productos.array.length === 0)
        ? 1 : productos.array[productos.array.length-1]?.id+1 // esto le pone el id desde el backend
        productos.array.push(data);
        io.sockets.emit("productos", productos.array);
    });
})


// server listen
HttpServer.listen(8080, ()=>{
    console.log(`servidor iniciado`)
})
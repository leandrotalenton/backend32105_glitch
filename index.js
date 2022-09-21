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
const Mensajes = [
    { autor: "Jose", msj: "hola mundo!" },
    { autor: "maria", msj: "hola coder!" },
    { autor: "pedro", msj: "hola todos!" },
];

io.on('connection', (socket)=>{
    console.log(`Cliente conectado a ${socket}`)
    socket.emit("mensajes", Mensajes);

    socket.on("new_msg", (data) => {
        console.log(data);
        Mensajes.push(data);
        io.sockets.emit("mensajes", Mensajes);
    });

})



// server listen
// app.listen(8080, ()=>{
HttpServer.listen(8080, ()=>{
    console.log(`servidor iniciado`)
})
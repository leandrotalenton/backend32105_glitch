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

// fileSystem
const fs = require("fs");



//


// static files
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// template engines
app.set("views","./views")
app.set("view engine","ejs")

// routers
const productos = require("./routers/productos")
app.use("/api/productos", productos.routes)

app.get("/", (req, res)=>{
    res.render(`./index`, {arrProductos:productos.array})
})

// socket events
const Mensajes = [{"autor":"leandro","msj":"hola","date":"9/21/2022, 10:29:45 PM"}]

io.on('connection', (socket)=>{
    console.log(`Cliente conectado, id: ${socket.id}`)

    // chat
    socket.emit("mensajes", Mensajes);
    // (async function getAll(){
    //     const currentMensajes = await fs.promises.readFile(`./fileStorage/mensajes.json`, "utf-8");
    //     const mensajes = JSON.parse(currentMensajes);
    //     Mensajes=mensajes
    //     socket.emit("mensajes", Mensajes)
    //     // console.log(mensajes)
    // })()
    socket.on("new_msg", (data) => {
        const currDate = new Date()
        data.date= `${currDate.toLocaleString()}`
        Mensajes.push(data);
        io.sockets.emit("mensajes", Mensajes);
        fs.promises.writeFile(`./fileStorage/mensajes.json`,JSON.stringify(Mensajes)) // version rancia que pisa todo
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
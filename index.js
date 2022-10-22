// express 
import express from 'express'
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// socket.io (config)
import { Server as HTTPServer } from "http"
import { Server as SocketServer } from "socket.io"
const HttpServer = new HTTPServer(app)
const io = new SocketServer(HttpServer)

// fileSystem
import fs from "fs"

// static files
import path from 'path'
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, 'public')));

// template engines
app.set("views","./views")
app.set("view engine","ejs")

// routers
import { router, arrProductos } from "./routers/productos.js"
app.use("/api/productos", router)

app.get("/", (req, res)=>{
    res.render(`./index`, {arrProductos: arrProductos}) // <-- esto me parece raro
})

// socket events
const Mensajes = [{"autor":"leandro","msj":"hola","date":"9/21/2022, 10:29:45 PM"}]

io.on('connection', (socket)=>{
    console.log(`Cliente conectado, id: ${socket.id}`)

    // chat
    socket.emit("mensajes", Mensajes);

    socket.on("new_msg", (data) => {
        const currDate = new Date()
        data.date= `${currDate.toLocaleString()}`
        Mensajes.push(data);
        io.sockets.emit("mensajes", Mensajes);
        fs.promises.writeFile(`./fileStorage/mensajes.json`,JSON.stringify(Mensajes)) // version rancia que pisa todo
    });

    // prod
    socket.emit("productos", arrProductos);
    socket.on("new_prod", (data) => {
        data.id = (arrProductos.length === 0)
        ? 1 : arrProductos[arrProductos.length-1]?.id+1 // esto le pone el id desde el backend
        arrProductos.push(data);
        io.sockets.emit("productos", arrProductos);
    });
})


// server listen
HttpServer.listen(8080, ()=>{
    console.log(`servidor iniciado`)
})
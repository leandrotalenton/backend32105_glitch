// express 
import express from 'express'
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// socket.io (config)
import { Server as HTTPServer } from "http";
import { Server } from 'socket.io';
const HttpServer = new HTTPServer(app)
const io = new Server(HttpServer)

// fileSystem
import fs from "fs"

// DB
import { Container } from './dbConnection/container.js';
import mySqlConfig from './dbConnection/mySqlConfig.js';
import sqliteConfig from './dbConnection/sqliteConfig.js';
const DbProductos = new Container(mySqlConfig, 'products')
const DbMensajes = new Container(sqliteConfig, 'messages')


// static files
import path from 'path'
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

// template engines
app.set("views","./views")
app.set("view engine","ejs")

// routers
import { router } from "./routers/productos.js"
app.use("/api/productos", router)

app.get("/", async (req, res)=>{
    res.render(`./index`, {arrProductos: await DbProductos.getAll()}) // <-- esto me parece raro
})

// socket events
// const mensajes = [{"autor":"leandro","msj":"hola","date":"9/21/2022, 10:29:45 PM"}]

// async function consolelogueameesta(){
//     const asd = await DbProductos.getAll()
//     console.log(`hola`,asd)
// }
// consolelogueameesta()

// async function consolelogueameestaa(){
//     const asd = await DbMensajes.getAll()
//     console.log(`hola`,asd)
// }
// consolelogueameestaa()

io.on('connection', async (socket)=>{
    console.log(`Cliente conectado, id: ${socket.id}`)

    // chat
    socket.emit("new_msg", await DbMensajes.getAll());
    socket.on("new_msg", async (data) => {
        try{
            const currDate = new Date()
            data.date= `${currDate.toLocaleString()}`
            await DbMensajes.save(data)
            const mensajes = await DbMensajes.getAll()
            io.sockets.emit("new_msg", mensajes);
        } catch(err) {
            console.log(err)
        }
    });

    // prod
    socket.emit("new_prod", await DbProductos.getAll());
    socket.on("new_prod", async (data) => {
        try{
            await DbProductos.save(data);
            const productos = await DbProductos.getAll();
            io.sockets.emit('new_prod', productos);
        } catch(err) {
            console.log(err)
        }
    });
})


// server listen
HttpServer.listen(8080, ()=>{
    console.log(`servidor iniciado`)
})
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
// import fs from "fs"

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
    res.render(`./index`, {arrProductos: await DbProductos.getAll()})
})

// list of products with faker
import { faker } from '@faker-js/faker'
faker.locale = ('es')

const genFakeProduct = ()=>{
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(100, 200, 2),
        thumbnail: faker.image.food(75, 75, true)
    }
}

app.get("/api/productos-test", async (req,res)=>{
    try{
        const arrProductos = []
        for(let i = 0 ; i < 5 ; i++){
            arrProductos.push(genFakeProduct())
        }
        res.render(`./partials/productosIndependientes`,{arrProductos})
    } catch(err) {
        res.status(404).send(err)
    }
})
// end of list of products with faker

// DAOs
import daos from "./daos/index.js"
const { chatsDAO } = await daos()

// normalizr

import util from 'util'
import { normalize, denormalize, schema } from 'normalizr';
const autoresSchema = new schema.Entity("autores");
const chatsSchema = new schema.Entity("chats", {mensajes:[{autor:autoresSchema}]});

io.on('connection', async (socket)=>{
    console.log(`Cliente conectado, id: ${socket.id}`)

    // chat
    socket.emit("new_msg", normalize({id: 'chats', mensajes: await chatsDAO.read() }, chatsSchema));
    socket.on("new_msg", async (data) => {
        try{
            const currDate = new Date()
            data.date= `${currDate.toLocaleString()}`
            await chatsDAO.create(data)
            const mensajesNormalizados = normalize({id: 'chats', mensajes: await chatsDAO.read() }, chatsSchema)
            console.log("mensajesNormalizados: ", util.inspect(mensajesNormalizados, false, 10, true ))
            io.sockets.emit("new_msg", mensajesNormalizados);
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
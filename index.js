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

const mockData = {
    id: "mensajes",
    chats: [
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "holaa!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 1
        },
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "asd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 2
        },
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "fdd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 3
        },
        {
            autor: {
                id: "guest@hotmail.com",
                nombre: "guest",
                apellido: "guest",
                edad: "30",
                alias: "guest",
                avatar: "guestAvatar"
            },
            msj: "fdd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 4
        },
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "fdd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 5
        },
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "fdd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 6
        },
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "fdd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 7
        },
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "fdd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 8
        },
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "fdd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 9
        },
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "fdd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 10
        },
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "holaa!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 11
        },
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "asd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 12
        },
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "fdd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 13
        },
        {
            autor: {
                id: "guest@hotmail.com",
                nombre: "guest",
                apellido: "guest",
                edad: "30",
                alias: "guest",
                avatar: "guestAvatar"
            },
            msj: "fdd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 14
        },
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "fdd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 15
        },
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "fdd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 16
        },
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "fdd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 17
        },
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "fdd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 18
        },
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "fdd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 19
        },
        {
            autor: {
                id: "leandrotalenton@hotmail.com",
                nombre: "leandro",
                apellido: "talenton",
                edad: "30",
                alias: "leny",
                avatar: "lenyAvatar"
            },
            msj: "fdd!!",
            date: "11/6/2022, 3:22:41 PM",
            id: 20
        },
    ]
}

const chatsMock = {
    id: 'chats',
    mensajes: [
        {
            autor: {
            id: '111',
            nombre: '111',
            apellido: '111',
            edad: '111',
            alias: '111',
            avatar: '111'
            },
            msj: '55',
            date: '11/6/2022, 8:54:39 PM',
            id: 1
        },
        {
            autor: {
            id: '111',
            nombre: '111',
            apellido: '111',
            edad: '111',
            alias: '111',
            avatar: '111'
            },
            msj: '55',
            date: '11/6/2022, 8:54:39 PM',
            id: 2
        },
        {
            autor: {
            id: '222',
            nombre: '111',
            apellido: '111',
            edad: '111',
            alias: '111',
            avatar: '111'
            },
            msj: '55',
            date: '11/6/2022, 8:54:39 PM',
            id: 3
        },
    ]
}

import util from 'util'
import { normalize, denormalize, schema } from 'normalizr';
const autoresSchema = new schema.Entity("autores");
const chatsSchema = new schema.Entity("chats", {mensajes:[{autor:autoresSchema}]});

// const normalizedMockData = normalize(chatsMock, chatsSchema)
// const denormalizedMockData = denormalize(normalizedMockData.result, chatsSchema, normalizedMockData.entities)

// console.log(
//     util.inspect( normalizedMockData, false, 10, true ) 
//     // JSON.parse(util.inspect( normalizedMockData, false, 10, true ) )
// )

// console.log("normal length", JSON.stringify(chatsMock).length)
// console.log("normalized length", JSON.stringify(normalizedMockData).length)
// console.log("denormalized length", JSON.stringify(denormalizedMockData).length)
// console.log("porcentaje de reduccion:", (JSON.stringify(normalizedMockData).length/JSON.stringify(mockData).length)*100,"%")

// data = {
//     "id": "mensajes",
//     "chats": []
// }

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
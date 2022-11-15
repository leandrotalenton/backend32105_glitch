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

// DB
import { Container } from './dbConnection/container.js';
import mySqlConfig from './dbConnection/mySqlConfig.js';
import sqliteConfig from './dbConnection/sqliteConfig.js';
const DbProductos = new Container(mySqlConfig, 'products')
const DbMensajes = new Container(sqliteConfig, 'messages')

// esto se agrega para guardar usuarios como se vio en el after del 10/11/2022
import DAOUsuarios from "./daos/usuarios/UsuariosDAO.js";
const MongoUsers = new DAOUsuarios();


// esto se agrega para utilizar sessions con mongoAtlas
import session, { Cookie } from 'express-session';
import MongoStore from 'connect-mongo';
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(session({
    secret: "secret123123",
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://LeandroCoder:Coder123123@clusterleandrocoder.fyskstk.mongodb.net/leandroCoderDb",
        mongoOptions,
        
    }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 600000 } // 10min
}))


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

//routes
app.get("/", async (req, res)=>{
    if(req.session.usuario){
        res.render(`./index`, {arrProductos: await DbProductos.getAll(), nombre: req.session.usuario})
    } else {
        if(req.query.error){
            res.status(404).render('./login', {error: req.query.error} )
        } else {
            res.render('./login', {error: req.query.error} )
        }
    }
})

app.get("/signup", (req,res)=>{
    req.session.destroy()
    res.render("./signUp")
})

app.get("/logout", (req, res)=>{
    let nombre = req.session.usuario
    req.session.destroy((err)=>{
        res.render("./logout", { nombre })
    })
})

//signUp POST
app.post("/register", async(req, res) => {
    try{
        const { username, password } = req.body;
        await MongoUsers.create({username, password});
        req.session.rank = 0
        req.session.usuario = username
        res.redirect("/")
    } catch(e) {
        res.redirect("/?error=true")
    }
})

//login POST
app.post("/", async(req, res) => {
    try{
        const { username, password } = req.body;
        const usuario = await MongoUsers.readByUsernameAndPassword(username, password); // cheackear como es y alterar el DAO
        console.log(usuario)
        req.session.rank = usuario.rank
        req.session.usuario = username
        res.redirect("/")
    } catch(e) {
        res.redirect("/?error=true")
    }
})


// list of products with faker
// import { faker } from '@faker-js/faker'
// faker.locale = ('es')

// const genFakeProduct = ()=>{
//     return {
//         title: faker.commerce.productName(),
//         price: faker.commerce.price(100, 200, 2),
//         thumbnail: faker.image.food(75, 75, true)
//     }
// }

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
            // console.log("mensajesNormalizados: ", util.inspect(mensajesNormalizados, false, 10, true ))
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
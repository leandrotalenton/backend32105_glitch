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

// se agregan las cosas para trabajar con passport-local y encriptador de contrasenias
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import bcrypt from "bcrypt"
const hashPassword = (pass) => {
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(10), null)
}
const validatePassword = (pass, hashedPassword) => {
    return bcrypt.compareSync(pass, hashedPassword)
}



passport.use(
    "signUp",
    new LocalStrategy({}, async (username, password, done) => {
            const existantUser = await MongoUsers.readByUsername(username)
            if(existantUser) { return done(null, false) }

            await MongoUsers.create({username, password: hashPassword(password)}) // <-- hashear esta password despues
            const user = await MongoUsers.readByUsername(username)
            return done (null, user)
    })
)

passport.use(
    "logIn",
    new LocalStrategy({}, async (username, password, done) => {
            const user = await MongoUsers.readByUsername(username)
            if (!user || !validatePassword(password, user.password)) { return done(null, false) } // <-- cambiar por el validador de pass
            return done(null, user)
    })
)

passport.serializeUser((userObj, done) => {
    console.log("se ejecuta el serializeUser con esta info: ", userObj)
    done(null, userObj._id)
})

passport.deserializeUser( async(id, done)=>{
    console.log("se ejecuta el deserializeUser con esta info: ", id)
    const user = await MongoUsers.readById(id)
    console.log("esto me trae el deserializer: ", user)
    done(null, user)
})

app.use(passport.initialize())
app.use(passport.session())

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

const authMw = (req, res, next) => {
    req.isAuthenticated() ? next() : res.render('./login', {error: req.query.error} )
}

app.get("/", authMw ,async (req, res)=>{
    res.render(`./index`, {arrProductos: await DbProductos.getAll(), nombre: req.user.username})
})

app.get("/signup", (req,res)=>{
    req.session.destroy()
    res.render("./signUp")
})

app.get("/logout", (req, res)=>{
    let nombre = req.user.username
    req.logOut({},(err)=>{
        if (err) { return next(err); }
        res.render("./logout", { nombre })
    })
})

//signUp POST
app.post(
    "/register",
    passport.authenticate("signUp", {failureRedirect: "/?error=true"}),
    async(req, res) => {
        res.redirect("/")
    }
)

//login POST
app.post(
    "/",
    passport.authenticate("logIn", {failureRedirect: "/?error=true"}),
    async(req, res) => {
        res.redirect("/")
    }
)

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
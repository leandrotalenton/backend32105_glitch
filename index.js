const express = require('express');
const app = express();
const productos = require("./routers/productos")
const handlebars = require("express-handlebars")

const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.engine(
    "hbs",
    handlebars.engine({
        extname:"hbs",
        layoutsDir: __dirname + "/views", // capaz que hay que agregarle el ./
        defaultLayout: null
    })
)

app.set("views","./views")
app.set("view engine","hbs")

app.use("/api/productos", productos)

app.use("/", (req, res)=>{
    res.render(`formulario`)
})

app.listen(8080, ()=>{
    console.log(`servidor iniciado`)
})
const express = require('express');
const app = express();
const productos = require("./routers/productos")

const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, 'public')));

app.set("views","./views")
app.set("view engine","ejs")

app.use("/api/productos", productos.routes)

app.get("/", (req, res)=>{
    res.render(`./formulario`)
})

app.listen(8080, ()=>{
    console.log(`servidor iniciado`)
})
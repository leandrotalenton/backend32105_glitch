const express = require('express');
const app = express();
const productos = require("./routers/productos")

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/productos", productos)

app.use("/", express.static(__dirname + "/assets"))

app.listen(8080, ()=>{
    console.log(`servidor iniciado`)
})
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

// let producto={
//     arrProductos: [ { title: '123', price: '123', thumbnail: '123', id: 1 } ]
// }

// console.log(`producto`,producto)
// console.log(`{arrProductos:productos.array}`,{arrProductos:productos.array})

app.get("/", (req, res)=>{
    res.render(`./formulario`, {arrProductos:productos.array})
})

app.listen(8080, ()=>{
    console.log(`servidor iniciado`)
})
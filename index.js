const express = require('express')
const app = express()

let productos

/* _____________________(INICIO) se trae lo del desafio anterior_____________________ */
const fs = require("fs");

class Container{
    constructor(file){
        this.file = file;
    }

    // metodo getAll()
    async getAll(){
        const currentProducts = await fs.promises.readFile(this.file, "utf-8");
        const products = JSON.parse(currentProducts);
        productos = products
    }
}

const fileProductos = "./productos.json";
const contenedor = new Container(fileProductos);


const ejecutar = async function(){
    await contenedor.getAll()
    console.log(`no hay problema willy`)
}
const test = ejecutar()
/* _____________________(FIN) se trae lo del desafio anterior_____________________ */


app.get("/", (req,res)=>{
    res.send('ir a "/productos" para ver un listado de todos los productos, ir a "/productoRandom" para ver un producto al azar');
})

//ruta get /productos que devuelva un array con todos los productos disponibles en el servidor
app.get("/productos", (req,res)=>{
    res.send(productos);
})

//ruta get /productoRandom que devuelva un producto elegido al azar entre todos los productos disponibles
app.get("/productoRandom", (req,res)=>{
    res.send(productos[parseInt(Math.random()*productos.length)]);
})

const server = app.listen(8080, ()=>{
    console.log("servidor express iniciado")
})
const express = require('express');
const {Router} = express;
const router = Router()

let productos = []

// devuelve todos los productos
router.get("/", (req,res)=>{
    // res.send(productos)
    res.render(`./productos`,{productos})
})

//devuelve un producto segun su id
router.get("/:id", (req,res)=>{
    const { id } = req.params
    const prodcuto = productos.find( p => p.id === parseInt(id))
    if(prodcuto){
        res.send(prodcuto)
    } else {
        res.status(404).send({error:`producto no encontrado`})
    }
})

//recibe y agrega un producto, y lo devuelve con su id asignado
router.post("/", (req,res)=>{
    if(productos.length !== 0 ){
        req.body.id = productos[productos.length-1]?.id+1
    } else {
        req.body.id = 1
    }
    productos.push(req.body)
    // res.send(req.body)
    res.redirect(`/`)
})

//recibe y actualiza un producto segun su id
router.put("/:id", (req,res)=>{
    const { id } = req.params
    const prodcutToReplace = productos.find( p => p.id === parseInt(id))
    if(prodcutToReplace){
        req.body.id = prodcutToReplace.id
        productos.splice(productos.indexOf(prodcutToReplace),1,req.body)
        res.send(productos)
    } else {
        res.status(404).send({error:`producto no encontrado`})
    }
})

//elimina un producto segun su id
router.delete("/:id", (req,res)=>{
    const { id } = req.params
    const prodcutToDelete = productos.find( p => p.id === parseInt(id))
    if(prodcutToDelete){
        req.body.id = prodcutToDelete.id
        productos.splice(productos.indexOf(prodcutToDelete),1)
        res.send(productos)
    } else {
        res.status(404).send({error:`producto no encontrado`})
    }
})

module.exports = router
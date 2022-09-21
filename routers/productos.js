const express = require('express');
const {Router} = express;
const router = Router()

let arrProductos = []

// devuelve todos los productos
router.get("/", (req,res)=>{
    // res.send(productos)
    res.render(`./productos`,{arrProductos})
})

//devuelve un producto segun su id
router.get("/:id", (req,res)=>{
    const { id } = req.params
    const prodcuto = arrProductos.find( p => p.id === parseInt(id))
    if(prodcuto){
        res.send(prodcuto)
    } else {
        res.status(404).send({error:`producto no encontrado`})
    }
})

//recibe y agrega un producto, y lo devuelve con su id asignado
router.post("/", (req,res)=>{
    if(arrProductos.length !== 0 ){
        req.body.id = arrProductos[arrProductos.length-1]?.id+1
    } else {
        req.body.id = 1
    }
    arrProductos.push(req.body)
    // res.send(req.body)
    res.redirect(`/`)
})

//recibe y actualiza un producto segun su id
router.put("/:id", (req,res)=>{
    const { id } = req.params
    const prodcutToReplace = arrProductos.find( p => p.id === parseInt(id))
    if(prodcutToReplace){
        req.body.id = prodcutToReplace.id
        arrProductos.splice(arrProductos.indexOf(prodcutToReplace),1,req.body)
        res.send(arrProductos)
    } else {
        res.status(404).send({error:`producto no encontrado`})
    }
})

//elimina un producto segun su id
router.delete("/:id", (req,res)=>{
    const { id } = req.params
    const prodcutToDelete = arrProductos.find( p => p.id === parseInt(id))
    if(prodcutToDelete){
        req.body.id = prodcutToDelete.id
        arrProductos.splice(arrProductos.indexOf(prodcutToDelete),1)
        res.send(arrProductos)
    } else {
        res.status(404).send({error:`producto no encontrado`})
    }
})

module.exports.routes = router
module.exports.array = arrProductos
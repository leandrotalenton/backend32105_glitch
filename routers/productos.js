import express from 'express'
const {Router} = express;
const router = Router()

import { Container } from '../dbConnection/container.js';
import mySqlConfig from '../dbConnection/mySqlConfig.js';
const DbProductos = new Container(mySqlConfig, 'products')


// devuelve todos los productos
router.get("/", async (req,res)=>{
    try{
        const arrProductos = await DbProductos.getAll()
        res.render(`./partials/productos`,{arrProductos})
    } catch(err) {
        res.status(404).send(err)
    }
})

//devuelve un producto segun su id
router.get("/:id", async (req,res)=>{
    try {
        const { id } = req.params
        const producto = await DbProductos.getById(id)
        res.send(producto)
    } catch(err) {
        res.status(404).send(err)
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

export { router }
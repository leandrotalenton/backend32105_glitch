import express from 'express'
const { Router } = express;
const router = Router()
import { fork } from "child_process"

router.get("/",(req,res)=>{
    const childProcess = fork("./forkedScripts/randoms.js")
    childProcess.on("message", msg =>{
        if(msg == 'listo'){
            childProcess.send(req.query.cant || 100000000)
        } else {
            res.send(msg)
        }
    })
    childProcess.on("exit", (code)=>{
        console.log("child process", code, "exited")
    })
})

export { router }

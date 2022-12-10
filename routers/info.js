import express from 'express';
import { cpus } from "os";
const {Router} = express;
const router = Router()

const cpu = cpus()

router.get("/", async (req,res)=>{
    try{
        res.send({
            argumentosDeEntrada: process.argv.slice(2),
            nombreDeLaPlataforma: process.platform,
            versionDeNode: process.version,
            memoriaTotalReservada: process.memoryUsage(),
            pathDeEjecucion: process.execPath,
            processId: process.pid,
            carpetaDelProyecto: process.cwd(),
            cantidadDeProcesadores: cpu.length
        })
    } catch(err) {
        res.status(404).send(err)
    }
})

export { router }
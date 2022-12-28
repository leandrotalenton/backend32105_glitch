import express from 'express';
import { cpus } from "os";
// import compression from "compression";
const {Router} = express;
const router = Router()

const cpu = cpus()

// sin compresion: 638 B
// con compresion: 661 B <-- la info que se enviaba parece ser demasiado pequeña como para que el middleware de compression pueda comprimirla

router.get("/", /* compression(), */ async (req,res)=>{
    try{
        const data = {
            argumentosDeEntrada: process.argv.slice(2),
            nombreDeLaPlataforma: process.platform,
            versionDeNode: process.version,
            memoriaTotalReservada: process.memoryUsage(),
            pathDeEjecucion: process.execPath,
            processId: process.pid,
            carpetaDelProyecto: process.cwd(),
            cantidadDeProcesadores: cpu.length
        }
        // console.log(data)
        res.send(data)
    } catch(err) {
        res.status(404).send(err)
    }
})

export { router }
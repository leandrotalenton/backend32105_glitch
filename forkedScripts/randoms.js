console.log("child process", process.pid, "created")

process.on("message", (cant)=>{
    const objetin = {}
    for(let i = 0; i < cant; i+=1){
        let random = parseInt(Math.random()*1000)
        objetin[random]
            ? objetin[random]++
            : objetin[random] = 1
    }
    process.send(objetin)
    process.exit(process.pid)
})

process.send('listo')

# backend32105_glitch

## Comandos:


# node:
argumentos:
 -p port. Puerto a utilizar
 -m method. Metodo a utilizar (CLUSTER || FORK)

ej: node index.js -p 8081 -m CLUSTER


 # forever
argumentos:
 -w watch. Puerto a utilizar
 -m method. Metodo a utilizar (CLUSTER || FORK)

ej. forever start index.js
ej. forever -w start index.js -m CLUSTER

verificar procesos forever activos:
forever list

terminar procesos forever:
forever stapall


# pm2
Modo fork:
pm2 start index.js --name="fork-lt"

Modo cluster:
pm2 start index.js --name="cluster-lt" -i <n> -- --port=8081

listar:
pm2 list

detener:
pm2 stop all

borrar:
pm2 delete all

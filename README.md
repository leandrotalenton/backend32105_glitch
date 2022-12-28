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



## Ejecucion mediante nginx

# En pm2 abrir ejecutar los siguientes comandos:
pm2 start index.js --name="fork-lt0" -- --port=8080
// pm2 start index.js --name="fork-lt1" -i 3 -- --port=8081 <-- esto era para la primer parte
pm2 start index.js --name="fork-lt2" -- --port=8082
pm2 start index.js --name="fork-lt3" -- --port=8083
pm2 start index.js --name="fork-lt4" -- --port=8084
pm2 start index.js --name="fork-lt5" -- --port=8085

# En nginx
copiar el contenido de nginx.conf en los archivos locales conf/nginx.conf
ejecutar nginx.exe

# En un explorador
Acceder a localhost:80 --> sera servido el contenido de localhost:8080
Acceder a localhost:80/api/randoms --> sera servido alguno de los forks de los puertos 8082 a 8085
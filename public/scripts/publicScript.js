const socket = io.connect();


// chat ///////////////////////////////////////////////////////////////////

// desnormalizacion de data:
const autoresSchema = new normalizr.schema.Entity("autores");
const chatsSchema = new normalizr.schema.Entity("chats", {mensajes:[{autor:autoresSchema}]});

function renderChat(data) {
    const chatHTML = data.map((msg) => `
        <li>
            <div>
                <span>${msg.autor.id} on [${msg.date}]: ${msg.msj}</span>
            </div>
        </li>
    `).join(" ");

    document.querySelector(`.chatContainer>ul`).innerHTML = chatHTML;
}

function enviarMensaje() {
    const data = {
        autor: {
            id: document.getElementById("email").value,
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            edad: document.getElementById("edad").value,
            alias: document.getElementById("alias").value,
            avatar: document.getElementById("avatar").value,
        },
        msj: document.getElementById("chat_mensaje").value 
    }
    socket.emit("new_msg", data);
    document.getElementById("chat_mensaje").value = "";
    return false;
}

socket.on("new_msg", (dataNormalizada) => {
    //denormalizacion de la data
    // console.log("esto recibe el front: ",dataNormalizada)
    const data = normalizr.denormalize(dataNormalizada.result, chatsSchema, dataNormalizada.entities).mensajes
    // console.log("esto intenta renderizar el front", normalizr.denormalize(dataNormalizada.result, chatsSchema, dataNormalizada.entities))
    console.log("porcentaje de reduccion de datos: ", (JSON.stringify(dataNormalizada).length/JSON.stringify(normalizr.denormalize(dataNormalizada.result, chatsSchema, dataNormalizada.entities)).length)*100,"%")
    renderChat(data);
})

// productos ////////////////////////////////////////////////////////////////

function renderProductos(data) {
    const productosHTML = data.map((producto) => `
        <tr>
            <td>${producto.title}</td>
            <td>${producto.price}</td>
            <td><img src=${producto.thumbnail}></td>
        </tr>
    `).join(" ");

    document.querySelector(`#productos--tbody`).innerHTML = productosHTML;
}

function enviarProducto() {
    socket.emit("new_prod", {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail:document.getElementById("thumbnail").value
    });
    document.getElementById("title").value=""
    document.getElementById("price").value=""
    document.getElementById("thumbnail").value=""
    return false;
}

socket.on("new_prod", (data) => {
    renderProductos(data);
})
const socket = io.connect();

// chat ///////////////////////////////////////////////////////////////////

function renderChat(data) {
    const chatHTML = data.map((msg) => `
        <li>
            <div>
                <span>${msg.autor} on [${msg.date}]: ${msg.msj}</span>
            </div>
        </li>
    `).join(" ");

    document.querySelector(`.chatContainer>ul`).innerHTML = chatHTML;
}

function enviarMensaje() {
    socket.emit("new_msg", {
        autor: document.getElementById("email").value,
        msj: document.getElementById("chat_mensaje").value 
    });
    document.getElementById("chat_mensaje").value = "";
    return false;
}

socket.on("new_msg", (data) => {
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
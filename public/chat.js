
function render(data) {
    const chatHTML = data.map((msg) => `
        <li class="clearfix">
            <div class="message-data">
                <span class="message-data-time">${msg.autor}</span>
            </div>
            <div class="message my-message">${msg.msj}</div>
        </li>
    `).join(" ");

    document.querySelector(`.chatContainer>ul`).innerHTML = chatHTML;
}

function enviarMensaje() {
    console.log(`enviando mensaje`)
    const nombre = document.getElementById("nombre").value;
    const msj = document.getElementById("chat_mensaje").value;
    document.getElementById("chat_mensaje").value = "";
    socket.emit("new_msg", { autor: nombre, msj: msj });
    return false;
}

const socket = io.connect();

socket.on("mensajes", (data) => {
    render(data);
})

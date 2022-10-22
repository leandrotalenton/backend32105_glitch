
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
    console.log(`enviando mensaje`)
    const email = document.getElementById("email").value;
    const msj = document.getElementById("chat_mensaje").value;
    document.getElementById("chat_mensaje").value = "";
    socket.emit("new_msg", { autor: email, msj: msj });
    return false;
}

socket.on("mensajes", (data) => {
    renderChat(data);
})

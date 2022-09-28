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
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const thumbnail = document.getElementById("thumbnail").value;
    document.getElementById("title").value=""
    document.getElementById("price").value=""
    document.getElementById("thumbnail").value=""
    socket.emit("new_prod", {
        title: title,
        price: price,
        thumbnail:thumbnail,
    });
    return false;
}

const socket = io.connect();

socket.on("productos", (data) => {
    // console.log(`se recibio el evento productos y esta es la data:`,data)
    renderProductos(data);
})


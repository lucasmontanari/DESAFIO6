const socket = io()
const formProductos = document.querySelector('#formProductos')
const producto = document.querySelector('#producto')
const precio = document.querySelector('#precio')
const imagen = document.querySelector('#imagen')
const formMensajes = document.querySelector('#formMensajes')
const email = document.querySelector('#email')
const mensaje = document.querySelector('#mensaje')

//PRODUCTOS
async function renderProducts(productos) {
    if(productos.length > 0){
        document.querySelector('#tabla').classList.remove('eliminarVista')
        const response = await fetch('./productos.ejs')
        const plantilla = await response.text()
        document.querySelector('#datos-productos').innerHTML = ''
        productos.forEach(product => {
            const html = ejs.render(plantilla, product)
            document.querySelector('#datos-productos').innerHTML += html
        })
        document.querySelector('#lista-vacia').classList+=' eliminarVista'
    }else{
        document.querySelector('#lista-vacia').classList.remove('eliminarVista')
        document.querySelector('#tabla').classList+=' eliminarVista'
    }
} 

socket.on('server:productos', products => {
    renderProducts(products)
})

formProductos.addEventListener('submit', event => {
    event.preventDefault()
    const nuevoProducto = {"nombre":producto.value ,"precio": precio.value,"imagen": imagen.value}
    socket.emit('cliente:producto', nuevoProducto)
    producto.value=""
    precio.value=""
    imagen.value=""
})


//MENSAJES
async function renderMensajes(mensajes) {
        const response = await fetch('./mensajes.ejs')
        const plantilla = await response.text()
        document.querySelector('#chat').innerHTML = ''
        mensajes.forEach(mensaje => {
            const html = ejs.render(plantilla, mensaje)
            document.querySelector('#chat').innerHTML += html
        })
} 

socket.on('server:mensajes', mensajes => {
    renderMensajes(mensajes)
})

formMensajes.addEventListener('submit', event => {
    event.preventDefault()
    fecha = new Date().toLocaleString()
    const nuevoMensaje = {"email":email.value ,"hora": fecha,"mensaje": mensaje.value}
    console.log(nuevoMensaje)
    socket.emit('cliente:mensaje', nuevoMensaje)
    mensaje.value = "" //Para limpiar el campo mensajes y poder escribir otro
})



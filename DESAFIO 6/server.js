const express = require('express')
const app = express()
const path = require('path')
const { Server: IOServer } = require('socket.io')
const expressServer = app.listen(8080, () => console.log('Servidor escuchando puerto 8080'))
const io = new IOServer(expressServer)
const fs = require('fs')

const productos=[{"nombre":"Death Note","precio":567.89,"imagen":"https://http2.mlstatic.com/D_NQ_NP_805388-MLA44665758739_012021-O.jpg","id":1},{"nombre":"Chainsaw Man","precio":601.56,"imagen":"https://www.normaeditorial.com/upload/media/albumes/0001/07/fb73dc7a21d6a8f594f276d740675be20348aa57.jpeg","id":2},{"nombre":"Naruto Shippuden","precio":598.23,"imagen":"https://i.pinimg.com/736x/f3/5a/19/f35a190feaedcb257518c09d0f79b14f.jpg","id":3}]
let mensajes=[]

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(express.static(path.join(__dirname, './public')))


io.on('connection', async socket => {
    console.log(`Se conecto un usuario ${socket.id}`)
    socket.emit('server:productos', productos)
    try{
        mensajes = JSON.parse(await fs.promises.readFile(`./mensajesGuardados.txt`, 'utf-8'));
        socket.emit('server:mensajes', mensajes)
    }catch(error){
        console.log(`Error al adquirir los mensajes ${error}`)
    }
    socket.on('cliente:mensaje', nuevoMensaje => {
        mensajes.push(nuevoMensaje)
        fs.promises.writeFile(`./mensajesGuardados.txt`, JSON.stringify(mensajes))
        io.emit('server:mensajes', mensajes)
    })
    socket.on('cliente:producto', nuevoProducto => {
        productos.push(nuevoProducto)
        io.emit('server:productos', productos)
    })
})
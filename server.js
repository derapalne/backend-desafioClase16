const ArchivadorProductos = require("./src/archivadorProductos");
const { optionsMariaDB } = require("./options/mariaDB");
const ArchivadorMensajes = require("./src/archivadorMensajes");
const { optionsSQLite } = require("./options/SQLite3");

const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const archMensajes = new ArchivadorMensajes("chat", optionsSQLite);
archMensajes.chequearTabla();
const archProductos = new ArchivadorProductos("productos", optionsMariaDB);
archProductos.chequearTabla();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));
app.set("views", "./public/views");
app.set("view engine", "ejs");

const inicializarProductos = () => {
    archProductos.save({
        title: "Onigiri",
        price: 200,
        thumbnail:
            "https://cdn3.iconfinder.com/data/icons/food-solid-in-the-kitchen/512/Onigiri-256.png",
    });

    archProductos.save({
        title: "Biological Warfare",
        price: 800000000,
        thumbnail: "https://cdn0.iconfinder.com/data/icons/infectious-pandemics-1/480/12-virus-256.png",
    });

    archProductos.save({
        title: "Eg",
        price: 120,
        thumbnail:
            "https://cdn3.iconfinder.com/data/icons/food-solid-in-the-kitchen/512/Egg_and_bacon-256.png",
    });
};

// inicializarProductos();

app.get("/", async (req, res) => {
    const productos = await archProductos.getAll();
    const mensajes = await archMensajes.read();
    // console.log("mensajes", mensajes);
    res.render("productosForm", { prods: productos, mensajes: mensajes});
});

const PORT = 8080;
httpServer.listen(PORT, () => console.log("Lisstooooo ", PORT));

io.on("connection", (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id.substring(0, 4)}`);
    socket.on("productoAgregado", async (producto) => {
        // console.log(producto);
        const respuestaApi = await archProductos.save(producto);
        console.log({respuestaApi});
        // respuestaApi es el ID del producto, si no es un n??mero, es un error (ver API)
        if (isNaN(respuestaApi)) {
            socket.emit("productoInvalido", respuestaApi);
        } else {
            console.log(respuestaApi, "producto valido");
            io.sockets.emit("productosRefresh", await archProductos.getAll());
        }
    });

    socket.on("mensajeEnviado", async (mensaje) => {
        await archMensajes.save(mensaje);
        io.sockets.emit("chatRefresh", mensaje);
    });
});

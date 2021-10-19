import express, { Application } from "express"
import morgan from "morgan"
import cors from "cors"
import indexRoutes from "./routes/indexRoutes"
import exphbs from "express-handlebars"
import path from "path"
import userRoutes from "./routes/userRoutes"
import articulosRoutes from "./routes/articulosRoutes"
import compraRoutes from "./routes/compraRoutes"
import session from "express-session"
import flash from "connect-flash"
import adminRoutes from "./routes/adminRoutes"

import { Server } from "socket.io"
import http from "http"

declare module "express-session" {
    export interface SessionData {
        user: { [key: string]: any } | any //en user guardaremos datos de interes
        auth: boolean //indicara si el usuario ha iniciado sesion o no.
        carrito: { [key: number]: any } | any
        partido: { [key: number]: any } | any
        total: number | any
        adminkey: boolean //para ver si sos admin :D
        userkey: number | any
    }
}

class AppServer {
    public app: Application
    public io: Server
    public server: any
    constructor() {
        this.app = express()
        this.server = http.createServer(this.app)
        this.io = new Server(this.server)
        this.startChat()
        this.config()
        this.routes()
    }
    startChat(): void {
        let { io } = this
        let usersConnected: number[] = []
        io.on("connection", socket => {
            // La room es el id del Partido
            socket.on("create", room => {
                socket.join(room)

                if (!usersConnected[room]) usersConnected[room] = 0
                usersConnected[room] += 1
                io.sockets
                    .in(room)
                    .emit("users quantity update", usersConnected[room])
                console.log("an user connected")

                socket.on("chat message", (sender, msg) => {
                    io.sockets.in(room).emit("chat message", sender, msg)
                    console.log(`${sender}: ${msg}`)
                })

                socket.on("disconnect", () => {
                    usersConnected[room] -= 1
                    io.sockets
                        .in(room)
                        .emit("users quantity update", usersConnected[room])
                    console.log("user disconnected")
                })
            })
        })
    }
    config(): void {
        let { app } = this
        //Configuraciones
        app.set("port", process.env.PORT || 3000)
        app.set("views", path.join(__dirname, "views")) //indicamos que views esta en dist y no en el modulo principal
        app.engine(
            ".hbs",
            exphbs({
                //nombre del motor, configuracion
                defaultLayout: "main",
                layoutsDir: path.join(this.app.get("views"), "layouts"),
                partialsDir: path.join(this.app.get("views"), "partials"),
                extname: "hbs", //definimos la extension de los archivos
                helpers: require("./lib/handlebars"), //definimos donde estan los helpers
            })
        )
        app.set("view engine", ".hbs") //ejecutamos el modulo definido

        //Middlewares
        app.use(morgan("dev"))
        app.use(cors()) //iniciamos cors
        app.use(express.json()) //habilitamos el intercambio de objetos json entre aplicaciones
        app.use("/public", express.static("public"))
        app.use(express.urlencoded({ extended: true })) //habilitamos para recibir datos a traves de formularios html.
        //configuracion del middeware de sesion
        app.use(
            session({
                secret: "secret_supersecret", //sirve para crear el hash del SSID unico
                resave: false, //evita el guardado de sesion sin modificaciones
                saveUninitialized: false, //indica que no se guarde la sesion hasta que se inicialice
            })
        )
        app.use(flash())

        //Variables globales
        app.use((req, res, next) => {
            app.locals.error_session = req.flash("error_session")
            app.locals.confirmacion = req.flash("confirmacion")
            app.locals.login = req.session.auth
            app.locals.Articulo_Eliminado = req.flash("Articulo_Eliminado")
            app.locals.Articulo_Modificado = req.flash("Articulo_Modificado")
            app.locals.Articulo_Agregado = req.flash("Articulo_Agregado")

            next()
        })
    }
    routes(): void {
        let { app } = this
        app.use(indexRoutes)
        app.use("/user", userRoutes)
        app.use("/articulos", articulosRoutes)
        app.use("/compra", compraRoutes)
        app.use("/admin", adminRoutes)
    }
    start(): void {
        let { server } = this
        server.listen(this.app.get("port"), () => {
            console.log("Sever escuchando" + this.app.get("port"))
        })
    }
}

const server = new AppServer()
server.start() //Ejecutamos el metodo start en inica el server

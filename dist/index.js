"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const path_1 = __importDefault(require("path"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const articulosRoutes_1 = __importDefault(require("./routes/articulosRoutes"));
const compraRoutes_1 = __importDefault(require("./routes/compraRoutes"));
const express_session_1 = __importDefault(require("express-session"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
class AppServer {
    constructor() {
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        this.io = new socket_io_1.Server(this.server);
        this.startChat();
        this.config();
        this.routes();
    }
    startChat() {
        let { io } = this;
        let usersConnected = [];
        io.on("connection", (socket) => {
            // La room es el id del Partido
            socket.on("create", (room) => {
                socket.join(room);
                if (!usersConnected[room])
                    usersConnected[room] = 0;
                usersConnected[room] += 1;
                io.sockets
                    .in(room)
                    .emit("users quantity update", usersConnected[room]);
                console.log("an user connected");
                socket.on("chat message", (sender, msg) => {
                    io.sockets.in(room).emit("chat message", sender, msg);
                    console.log(`${sender}: ${msg}`);
                });
                socket.on("disconnect", () => {
                    usersConnected[room] -= 1;
                    io.sockets
                        .in(room)
                        .emit("users quantity update", usersConnected[room]);
                    console.log("user disconnected");
                });
            });
        });
    }
    config() {
        let { app } = this;
        //Configuraciones
        app.set("port", process.env.PORT || 3000);
        app.set("views", path_1.default.join(__dirname, "views")); //indicamos que views esta en dist y no en el modulo principal
        app.engine(".hbs", (0, express_handlebars_1.default)({
            //nombre del motor, configuracion
            defaultLayout: "main",
            layoutsDir: path_1.default.join(app.get("views"), "layouts"),
            partialsDir: path_1.default.join(app.get("views"), "partials"),
            extname: "hbs",
            helpers: require("./lib/handlebars"), //definimos donde estan los helpers
        }));
        app.set("view engine", ".hbs"); //ejecutamos el modulo definido
        //Middlewares
        app.use((0, morgan_1.default)("dev"));
        app.use((0, cors_1.default)()); //iniciamos cors
        app.use(express_1.default.json()); //habilitamos el intercambio de objetos json entre aplicaciones
        app.use("/public", express_1.default.static("public"));
        app.use(express_1.default.urlencoded({ extended: true })); //habilitamos para recibir datos a traves de formularios html.
        //configuracion del middeware de sesion
        app.use((0, express_session_1.default)({
            secret: "secret_supersecret",
            resave: false,
            saveUninitialized: false, //indica que no se guarde la sesion hasta que se inicialice
        }));
        app.use((0, connect_flash_1.default)());
        //Variables globales
        app.use((req, res, next) => {
            app.locals.error_session = req.flash("error_session");
            app.locals.confirmacion = req.flash("confirmacion");
            app.locals.login = req.session.auth;
            app.locals.Articulo_Eliminado = req.flash("Articulo_Eliminado");
            app.locals.Articulo_Modificado = req.flash("Articulo_Modificado");
            app.locals.Articulo_Agregado = req.flash("Articulo_Agregado");
            next();
        });
    }
    routes() {
        let { app } = this;
        app.use(indexRoutes_1.default);
        app.use("/user", userRoutes_1.default);
        app.use("/articulos", articulosRoutes_1.default);
        app.use("/compra", compraRoutes_1.default);
        app.use("/admin", adminRoutes_1.default);
    }
    start() {
        let { server, app } = this;
        server.listen(app.get("port"), () => {
            console.log("Sever escuchando" + app.get("port"));
        });
    }
}
const server = new AppServer();
server.start(); //Ejecutamos el metodo start en inica el server
//# sourceMappingURL=index.js.map
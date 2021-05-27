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
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    config() {
        //Configuraciones
        this.app.set('port', process.env.PORT || 3000);
        this.app.set('views', path_1.default.join(__dirname, 'views')); //indicamos que views esta en dist y no en el modulo principal
        this.app.engine('.hbs', express_handlebars_1.default({
            defaultLayout: 'main',
            layoutsDir: path_1.default.join(this.app.get('views'), 'layouts'),
            partialsDir: path_1.default.join(this.app.get('views'), 'partials'),
            extname: 'hbs',
            helpers: require('./lib/handlebars') //definimos donde estan los helpers
        }));
        this.app.set('view engine', '.hbs'); //ejecutamos el modulo definido
        //Middlewares
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default()); //iniciamos cors
        this.app.use(express_1.default.json()); //habilitamos el intercambio de objetos json entre aplicaciones
        this.app.use(express_1.default.urlencoded({ extended: true })); //habilitamos para recibir datos a traves de formularios html.
        //configuracion del middeware de sesion
        this.app.use(express_session_1.default({
            secret: 'secret_supersecret',
            resave: false,
            saveUninitialized: false //indica que no se guarde la sesion hasta que se inicialice
        }));
        this.app.use(connect_flash_1.default());
        //Variables globales
        this.app.use((req, res, next) => {
            this.app.locals.error_session = req.flash('error_session');
            this.app.locals.confirmacion = req.flash('confirmacion');
            this.app.locals.login = req.session.auth;
            this.app.locals.Articulo_Eliminado = req.flash("Articulo_Eliminado");
            this.app.locals.Articulo_Modificado = req.flash("Articulo_Modificado");
            this.app.locals.Articulo_Agregado = req.flash("Articulo_Agregado");
            next();
        });
    }
    routes() {
        this.app.use(indexRoutes_1.default);
        this.app.use("/user", userRoutes_1.default);
        this.app.use("/articulos", articulosRoutes_1.default);
        this.app.use("/compra", compraRoutes_1.default);
        this.app.use("/admin", adminRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log("Sever escuchando" + this.app.get('port'));
        });
    }
}
const server = new Server();
server.start(); //Ejecutamos el metodo start en inica el server
//# sourceMappingURL=index.js.map
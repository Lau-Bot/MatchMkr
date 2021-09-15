"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controller/userController"));
class UserRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get("/", (req, res) => {
            res.send("Main!!!");
        });
        this.router.get("/signin", userController_1.default.signin);
        this.router.post("/signin", userController_1.default.login);
        //registro
        this.router.get("/signup", userController_1.default.signup);
        this.router.post("/signup", userController_1.default.addUser);
        //Home del usuario
        //this.router.get("/home", userController.home);
        this.router.get("/home", userController_1.default.listarPartidosActivos);
        this.router.post("/home", userController_1.default.process);
        //CRUD
        {
            this.router.get("/list", userController_1.default.list);
            this.router.get("/find/:id", userController_1.default.find);
            this.router.post("/add", userController_1.default.addUser);
            this.router.put("/update/:id", userController_1.default.update);
            this.router.delete("/delete/:id", userController_1.default.delete);
            this.router.get("/delete/:id", userController_1.default.delete);
        }
        //FIN CRUD
        this.router.get("/controls", userController_1.default.control);
        this.router.post("/procesar", userController_1.default.procesar);
        // SALIR de la sesion
        this.router.get("/salir", userController_1.default.endSession);
        this.router.get("/error", userController_1.default.showError);
        this.router.get("/crearpartido", userController_1.default.showcreatematchpage);
        this.router.post("/crearpartido", userController_1.default.creatematch);
        this.router.get("/carrito", userController_1.default.listarPartidosCreados);
        this.router.get("/matchinfo/:id", userController_1.default.showmatchinfo);
    }
}
//Exportamos el enrutador con
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
//# sourceMappingURL=userRoutes.js.map
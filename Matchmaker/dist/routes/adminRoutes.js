"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = __importDefault(require("../controller/adminController"));
class AdminRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', (req, res) => {
            res.send('Articulos!');
            //res.render("partials/principaasdl");
        });
        this.router.get('/home', adminController_1.default.home);
        this.router.get('/abmproductos', adminController_1.default.listar);
        this.router.get('/listarpedidos', adminController_1.default.listarpedidos);
        this.router.get("/delete/:id", adminController_1.default.delete);
        this.router.post("/agregar/", adminController_1.default.agregar);
        this.router.post("/modificar/:id", adminController_1.default.modificar);
        this.router.get('/error', adminController_1.default.showError);
        this.router.get('/salir', adminController_1.default.endSession);
    }
}
const adminRoutes = new AdminRoutes();
exports.default = adminRoutes.router;
//# sourceMappingURL=adminRoutes.js.map
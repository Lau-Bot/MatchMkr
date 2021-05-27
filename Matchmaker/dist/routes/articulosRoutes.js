"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articulosController_1 = __importDefault(require("../controller/articulosController"));
// import userController from '../controller/articulosController';
class ArticulosRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', (req, res) => {
            res.send('Articulos!');
            //res.render("partials/principal");
        });
        this.router.get('/listar', articulosController_1.default.listar);
        this.router.post('/comprar', articulosController_1.default.comprar);
        // this.router.get('/listarStock',articulosController.listarAndUpdate);
        // this.router.post('/modificar/:id',articulosController.modificar);
        // this.router.get('/modificando/:id',articulosController.modificando);
        // this.router.get('/eliminando/:id',articulosController.eliminando);
        // this.router.get('/agregar',articulosController.showaddProduct);
        // this.router.post('/agregar',articulosController.addProd);
    }
}
//Exportamos el enrutador con 
const articulosRoutes = new ArticulosRoutes();
exports.default = articulosRoutes.router;
//# sourceMappingURL=articulosRoutes.js.map
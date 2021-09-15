"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const articulosModel_1 = __importDefault(require("../models/articulosModel"));
class ArticulosController {
    listar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash("error_session", "Debes iniciar sesion para ver esta seccion");
                res.redirect("/user/signin");
            }
            const articulos = yield articulosModel_1.default.listar();
            return res.render("partials/articulos", { articulos, mi_session: true });
        });
    }
    comprar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) { //protege la sesion si no es verdadera --> configurada en el loguin  
                return res.redirect("/");
            }
            //console.log (req.body);
            req.session.carrito.push({
                "id": req.body.id,
                "nombre": req.body.nombre,
                "precio": req.body.precio,
                "cantidad": req.body.cantidad,
                "subtotal": req.body.precio * req.body.cantidad
            });
            req.session.total = req.session.total + (req.body.precio * req.body.cantidad);
            console.log(req.session.total);
            //console.log(req.session.carrito);   
            req.flash('confirmacion', 'El articulo ha sido agregado con éxito!!');
            res.redirect('./listar');
        });
    }
}
const articulosController = new ArticulosController();
exports.default = articulosController;
//# sourceMappingURL=articulosController.js.map
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
const compraModel_1 = __importDefault(require("../models/compraModel"));
class CompraController {
    listar(req, res) {
        res.render("partials/carrito", {
            carrito: req.session.carrito,
            total: req.session.total,
        });
    }
    verCarrito(req, res) {
        if (!req.session.auth) {
            req.flash("error", "Debe iniciar sesion para ver esta seccion");
            res.redirect("../user/signin");
            return res.redirect("/");
        }
        if (req.session.total == 0) {
            res.render("partials/carrito", {
                carrito: req.session.carrito,
                total: req.session.total,
            });
        }
        else {
            res.render("partials/carrito", {
                carrito: req.session.carrito,
                total: req.session.total,
                flag: true,
            });
        }
    }
    confirmar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                return res.redirect("/");
            }
            let pedido_articulo = [];
            let entrega = req.body;
            const id = yield compraModel_1.default.GuardarDatos(req.body); //toma pedido y lo guarda en la bd
            for (const i in req.session.carrito) {
                pedido_articulo.push({
                    id_pedido: id,
                    id_articulo: req.session.carrito[i].id,
                    precio: req.session.carrito[i].precio,
                    cantidad: req.session.carrito[i].cantidad,
                });
                yield compraModel_1.default.GuardarPedidoArticulo(pedido_articulo[0]);
                pedido_articulo = [];
            }
            req.session.carrito = [];
            req.session.total = 0;
            res.render("partials/pedidoOk", {
                pedido: id,
                compra: req.body,
                mi_session: true,
            });
        });
    }
}
const compraController = new CompraController();
exports.default = compraController;
//# sourceMappingURL=compraController.js.map
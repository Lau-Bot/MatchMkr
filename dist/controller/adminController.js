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
const adminModel_1 = __importDefault(require("../models/adminModel"));
class AdminController {
    home(req, res) {
        console.log(req.body);
        if (!req.session.auth) {
            req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
            res.redirect("./error");
            // res.redirect("/");
        }
        if (!req.session.adminkey) {
            req.flash("error_session", "No sos un administrador !!! :(");
            res.redirect("./error");
            //res.redirect("/");
        }
        //res.send('Bienvenido!!!');
        //res.render("partials/home");
        res.render("partials/homeAdmin", { mi_session: true });
    }
    listar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash("error_session", "Debes iniciar sesion para ver esta seccion");
                res.redirect("/user/signin");
            }
            if (!req.session.adminkey) {
                req.flash("error_session", "No sos un administrador !!! :(");
                res.redirect("./error");
                //res.redirect("/");
            }
            const articulos = yield adminModel_1.default.listararticulos();
            return res.render("partials/abmproductos", { articulos, mi_session: true });
        });
    }
    listarpedidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash("error_session", "Debes iniciar sesion para ver esta seccion");
                res.redirect("/user/signin");
            }
            if (!req.session.adminkey) {
                req.flash("error_session", "No sos un administrador !!! :(");
                res.redirect("./error");
                //res.redirect("/");
            }
            const pedidos = yield adminModel_1.default.listarpedidos();
            return res.render("partials/listarpedidos", { pedidos, mi_session: true });
        });
    }
    agregar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { descripcion, precio } = req.body;
            console.log(req.body);
            const busqueda = yield adminModel_1.default.buscarNombre(descripcion);
            if (!busqueda) {
                const result = yield adminModel_1.default.crear(descripcion, precio);
            }
            req.flash("Articulo_Agregado", "Se ha agregado el articulo");
            res.redirect("../abmproductos");
        });
    }
    modificar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, nombre, precio } = req.body;
            console.log(req.body);
            const result = yield adminModel_1.default.actualizar(id, nombre, precio);
            req.flash("Articulo_Modificado", "Se ha modificado el articulo");
            res.redirect("../abmproductos");
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const articulos = yield adminModel_1.default.eliminar(id);
            req.flash("Articulo_Eliminado", "Se ha eliminado el articulo");
            res.redirect("../abmproductos");
        });
    }
    endSession(req, res) {
        console.log(req.body);
        req.session.user = {};
        req.session.auth = false;
        req.session.destroy(() => console.log("Session finalizada"));
        res.redirect("/");
    }
    showError(req, res) {
        // res.send({ "Usuario y/o contraseña incorrectos": req.body });
        res.render("partials/error");
    }
}
const adminController = new AdminController();
exports.default = adminController;
//# sourceMappingURL=adminController.js.map
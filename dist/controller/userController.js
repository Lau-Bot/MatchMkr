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
const userModel_1 = __importDefault(require("../models/userModel"));
class UserController {
    signin(req, res) {
        console.log(req.body);
        res.render("partials/signinForm");
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, password } = req.body; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const result = yield userModel_1.default.buscarNombre(usuario);
            console.log(usuario);
            console.log(password);
            console.log("THIS RESULT:", result);
            if ((result === null || result === void 0 ? void 0 : result.usuario) == usuario &&
                (result === null || result === void 0 ? void 0 : result.password) == password &&
                (result === null || result === void 0 ? void 0 : result.rol) == true) {
                req.session.user = result;
                req.session.auth = true;
                req.session.adminkey = true;
                req.session.userkey = result === null || result === void 0 ? void 0 : result.id;
                //@ts-ignore
                req.session.username = result.usuario;
                res.redirect("../admin/home");
                return;
            }
            else if ((result === null || result === void 0 ? void 0 : result.usuario) == usuario && (result === null || result === void 0 ? void 0 : result.password) == password) {
                req.session.user = result;
                req.session.auth = true;
                req.session.adminkey = false;
                req.session.userkey = result === null || result === void 0 ? void 0 : result.id;
                res.redirect("./home");
                return;
            }
            //res.send({ "Usuario y/o contrase??a incorrectos": req.body });
            req.flash("error_session", "Usuario y/o Password Incorrectos");
            res.redirect("./error");
        });
    }
    showError(req, res) {
        // res.send({ "Usuario y/o contrase??a incorrectos": req.body });
        res.render("partials/alert", {
            alert_title: "Error",
            alert_body: "Debes iniciar sesion para crear un partido",
            gologin: true,
        });
    }
    //registro
    signup(req, res) {
        console.log(req.body);
        //res.send('Sign Up!!!');
        res.render("partials/signupForm");
    }
    home(req, res) {
        console.log(req.body);
        if (!req.session.auth) {
            req.flash("error_session", "Debes iniciar sesion para ver esta seccion");
            res.redirect("./error");
            // res.redirect("/");
        }
        //res.send('Bienvenido!!!');
        //res.render("partials/home");
        res.render("partials/home", { mi_session: true });
    }
    process(req, res) {
        console.log(req.body);
        res.send("Datos recibidos!!!");
        //res.render("partials/home",{listado});
    }
    //CRUD
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const usuarios = yield userModel_1.default.listar();
            console.log(usuarios);
            return res.json(usuarios);
            //res.send('Listado de usuarios!!!');
        });
    }
    find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.params.id);
            const { id } = req.params;
            const usuario = yield userModel_1.default.buscarId(id);
            if (usuario)
                return res.json(usuario);
            res.status(404).json({ text: "User doesn't exists" });
        });
    }
    addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = req.body;
            delete usuario.repassword;
            console.log(req.body);
            //res.send('Usuario agregado!!!');
            const busqueda = yield userModel_1.default.buscarNombre(usuario.usuario);
            const busquedaMail = yield userModel_1.default.buscarMail(usuario.email);
            if (!busqueda && !busquedaMail) {
                const result = yield userModel_1.default.crear(usuario);
                return res.render("partials/alert", {
                    alert_title: "Usuario guardado",
                    alert_body: "El usuario se ha creado correctamente!",
                    gologin: true,
                });
                //return res.json({ message: "Usuario guardado" })
            }
            return res.render("partials/alert", {
                alert_title: "Error",
                alert_body: "El nombre de usuario o email elegidos ya estan en uso, por favor intente ingresar otro",
                gosignup: true,
            });
            //return res.json({ message: "Nombre de usuario o email en uso" })
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const result = yield userModel_1.default.actualizar(req.body, id);
            //res.send('Usuario '+ req.params.id +' actualizado!!!');
            return res.json({ text: "updating a user " + id });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            //res.send('Usuario '+ req.params.id +' Eliminado!!!');
            const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const result = yield userModel_1.default.eliminar(id);
            // return res.json({ text: 'deleting a user ' + id });
            res.redirect("../controls");
        });
    }
    //FIN CRUD
    control(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash("error_session", "Debes iniciar sesion para ver esta seccion");
                res.redirect("./error");
                // res.redirect("/");
            }
            //res.send('Controles');
            const usuarios = yield userModel_1.default.listar();
            const users = usuarios;
            res.render("partials/controls", { users: usuarios, mi_session: true });
            //res.render('partials/controls', { users: {} });
        });
    }
    procesar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash("error_session", "Debes iniciar sesion para ver esta seccion");
                res.redirect("./error");
                //res.redirect("/");
            }
            console.log(req.body);
            let usuario = req.body.usuario;
            var usuarios = [];
            console.log(usuario);
            // if(usuario.length>0){
            if (usuario != undefined) {
                for (let elemento of usuario) {
                    const encontrado = yield userModel_1.default.buscarId(elemento);
                    if (encontrado) {
                        usuarios.push(encontrado);
                        console.log(encontrado);
                    }
                }
            }
            console.log(usuarios);
            res.render("partials/seleccion", {
                usuarios,
                home: req.session.user,
                mi_session: true,
            });
            res.render("partials/procesar");
        });
    }
    endSession(req, res) {
        console.log(req.body);
        req.session.user = {};
        req.session.auth = false;
        req.session.adminkey = false;
        req.session.destroy(() => console.log("Session finalizada"));
        res.redirect("/");
    }
    showcreatematchpage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash("error_session", "Debes iniciar sesion para crear un partido");
                res.redirect("./error");
                //res.redirect("/");
            }
            const sports = yield userModel_1.default.listarDeportes();
            console.log(req.body);
            res.render("partials/creatematch", { sports });
        });
    }
    creatematch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const match = req.body;
            console.log(req.body);
            const idOwner = req.session.userkey;
            yield userModel_1.default.creatematch(match, idOwner);
            //lo mando a carrito temporalmente para que no rompa
            res.render("partials/alert", {
                alert_title: "Partido Creado",
                alert_body: "Partido fue creado satisfactoriamente.",
                gohome: true,
            });
        });
    }
    showmatchinfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash("error_session", "Debes iniciar sesion para crear un partido");
                res.redirect("./error");
                //res.redirect("/");
            }
            if (yield userModel_1.default.isjoined(Number(req.params.id), Number(req.session.userkey))) {
                if (!req.session.auth) {
                    req.flash("error_session", "Debes iniciar sesion para crear un partido");
                    res.redirect("./error");
                    //res.redirect("/");
                }
                const matchinfo = yield userModel_1.default.showmatchinfo(Number(req.params.id).toString());
                matchinfo.fechaHasta = `
            ${matchinfo.fechaHasta.getDate() <= 9
                    ? "0" + matchinfo.fechaHasta.getDate()
                    : matchinfo.fechaHasta.getDate()}/${matchinfo.fechaHasta.getMonth() <= 9
                    ? "0" + matchinfo.fechaHasta.getMonth()
                    : matchinfo.fechaHasta.getMonth()}/${matchinfo.fechaHasta.getFullYear()} - ${matchinfo.fechaHasta.getHours() <= 9
                    ? "0" + matchinfo.fechaHasta.getHours()
                    : matchinfo.fechaHasta.getHours()}:${matchinfo.fechaHasta.getMinutes() <= 9
                    ? "0" + matchinfo.fechaHasta.getMinutes()
                    : matchinfo.fechaHasta.getMinutes()}hs`;
                matchinfo.deporte =
                    matchinfo.deporte.charAt(0).toUpperCase() +
                        matchinfo.deporte.slice(1);
                res.render("partials/matchinfojoined", {
                    matchinfo: Object.assign(Object.assign({}, matchinfo), { actual_user: req.session.user.usuario }),
                    volver: true,
                });
            }
            else {
                console.log(req.params.id);
                const { id } = req.params;
                const matchinfo = yield userModel_1.default.showmatchinfo(id);
                matchinfo.fechaHasta = `
        ${matchinfo.fechaHasta.getDate() <= 9
                    ? "0" + matchinfo.fechaHasta.getDate()
                    : matchinfo.fechaHasta.getDate()}/${matchinfo.fechaHasta.getMonth() <= 9
                    ? "0" + matchinfo.fechaHasta.getMonth()
                    : matchinfo.fechaHasta.getMonth()}/${matchinfo.fechaHasta.getFullYear()} - ${matchinfo.fechaHasta.getHours() <= 9
                    ? "0" + matchinfo.fechaHasta.getHours()
                    : matchinfo.fechaHasta.getHours()}:${matchinfo.fechaHasta.getMinutes() <= 9
                    ? "0" + matchinfo.fechaHasta.getMinutes()
                    : matchinfo.fechaHasta.getMinutes()}hs`;
                matchinfo.deporte =
                    matchinfo.deporte.charAt(0).toUpperCase() +
                        matchinfo.deporte.slice(1);
                res.render("partials/matchinfo", {
                    matchinfo: Object.assign(Object.assign({}, matchinfo), { actual_user: req.session.user.usuario }),
                    isJoinable: matchinfo.jugadoresFaltantes > 0,
                    volver: true,
                });
            }
        });
    }
    joinmatch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash("error_session", "Debes iniciar sesion para crear un partido");
                res.redirect("./error");
                //res.redirect("/");
            }
            console.log("ok");
            console.log(req.session);
            console.log(req.params.id);
            const result = yield userModel_1.default.joinmatch(Number(req.params.id), Number(req.session.userkey));
            console.log(result);
            const matchinfo = yield userModel_1.default.showmatchinfo(Number(req.params.id).toString());
            matchinfo.fechaHasta = `
        ${matchinfo.fechaHasta.getDate() <= 9
                ? "0" + matchinfo.fechaHasta.getDate()
                : matchinfo.fechaHasta.getDate()}/${matchinfo.fechaHasta.getMonth() <= 9
                ? "0" + matchinfo.fechaHasta.getMonth()
                : matchinfo.fechaHasta.getMonth()}/${matchinfo.fechaHasta.getFullYear()} - ${matchinfo.fechaHasta.getHours() <= 9
                ? "0" + matchinfo.fechaHasta.getHours()
                : matchinfo.fechaHasta.getHours()}:${matchinfo.fechaHasta.getMinutes() <= 9
                ? "0" + matchinfo.fechaHasta.getMinutes()
                : matchinfo.fechaHasta.getMinutes()}hs`;
            matchinfo.deporte =
                matchinfo.deporte.charAt(0).toUpperCase() +
                    matchinfo.deporte.slice(1);
            res.render("partials/matchinfojoined", {
                matchinfo: Object.assign(Object.assign({}, matchinfo), { actual_user: req.session.user.usuario }),
                volver: true,
            });
        });
    }
    showmatchinfojoined(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash("error_session", "Debes iniciar sesion para crear un partido");
                res.redirect("./error");
                //res.redirect("/");
            }
            const matchinfo = yield userModel_1.default.showmatchinfo(Number(req.params.id).toString());
            matchinfo.fechaHasta = `
        ${matchinfo.fechaHasta.getDate() <= 9
                ? "0" + matchinfo.fechaHasta.getDate()
                : matchinfo.fechaHasta.getDate()}/${matchinfo.fechaHasta.getMonth() <= 9
                ? "0" + matchinfo.fechaHasta.getMonth()
                : matchinfo.fechaHasta.getMonth()}/${matchinfo.fechaHasta.getFullYear()} - ${matchinfo.fechaHasta.getHours() <= 9
                ? "0" + matchinfo.fechaHasta.getHours()
                : matchinfo.fechaHasta.getHours()}:${matchinfo.fechaHasta.getMinutes() <= 9
                ? "0" + matchinfo.fechaHasta.getMinutes()
                : matchinfo.fechaHasta.getMinutes()}hs`;
            matchinfo.deporte =
                matchinfo.deporte.charAt(0).toUpperCase() +
                    matchinfo.deporte.slice(1);
            res.render("partials/matchinfojoined", {
                matchinfo: Object.assign(Object.assign({}, matchinfo), { actual_user: req.session.user.usuario }),
                volver: true,
            });
        });
    }
    /* public async showmatchinfojoined(req: Request, res: Response) {
        if (!req.session.auth) {
            req.flash(
                "error_session",
                "Debes iniciar sesion para crear un partido"
            );
            res.redirect("./error");
            //res.redirect("/");
        }
        console.log(req.params.id);
        const { id } = req.params;
        const matchinfo = await userModel.showmatchinfo(id);
        matchinfo.fechaHasta = `
        ${
            matchinfo.fechaHasta.getDate() <= 9
                ? "0" + matchinfo.fechaHasta.getDate()
                : matchinfo.fechaHasta.getDate()
        }/${
            matchinfo.fechaHasta.getMonth() <= 9
                ? "0" + matchinfo.fechaHasta.getMonth()
                : matchinfo.fechaHasta.getMonth()
        }/${matchinfo.fechaHasta.getFullYear()} - ${
            matchinfo.fechaHasta.getHours() <= 9
                ? "0" + matchinfo.fechaHasta.getHours()
                : matchinfo.fechaHasta.getHours()
        }:${
            matchinfo.fechaHasta.getMinutes() <= 9
                ? "0" + matchinfo.fechaHasta.getMinutes()
                : matchinfo.fechaHasta.getMinutes()
        }hs`;

        matchinfo.deporte =
            matchinfo.deporte.charAt(0).toUpperCase() +
            matchinfo.deporte.slice(1);
        res.render("partials/matchinfojoined", {
            matchinfo: matchinfo,
        });
    } */
    listarPartidosActivos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash("error_session", "Debes iniciar sesion para crear un partido");
                res.redirect("./error");
                //res.redirect("/");
            }
            const partidos = yield userModel_1.default.listarPartidosActivos();
            //@ts-ignore
            const partidosFinal = partidos.map((partido) => {
                partido.fechaHasta = `
            ${partido.fechaHasta.getDate() <= 9
                    ? "0" + partido.fechaHasta.getDate()
                    : partido.fechaHasta.getDate()}/${partido.fechaHasta.getMonth() <= 9
                    ? "0" + partido.fechaHasta.getMonth()
                    : partido.fechaHasta.getMonth()}/${partido.fechaHasta.getFullYear()} - ${partido.fechaHasta.getHours() <= 9
                    ? "0" + partido.fechaHasta.getHours()
                    : partido.fechaHasta.getHours()}:${partido.fechaHasta.getMinutes() <= 9
                    ? "0" + partido.fechaHasta.getMinutes()
                    : partido.fechaHasta.getMinutes()}hs`;
                partido.deporte =
                    partido.deporte.charAt(0).toUpperCase() +
                        partido.deporte.slice(1);
                return partido;
            });
            console.log(partidosFinal);
            return res.render("partials/home", {
                partidos: partidosFinal,
                mi_session: true,
            });
        });
    }
    listarPartidosCreados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash("error_session", "Debes iniciar sesion para crear un partido");
                res.redirect("./error");
                //res.redirect("/");
            }
            const match = req.body;
            const idOwner = req.body.idUsuarioOwner;
            console.log(req.body);
            console.log("este es el id owner: ", idOwner);
            const partidos = yield userModel_1.default.listarPartidosCreados(idOwner);
            console.log(partidos);
            return res.render("partials/home", {
                partidos: partidos,
                mi_session: true,
            });
        });
    }
}
const userController = new UserController();
exports.default = userController;
//# sourceMappingURL=userController.js.map
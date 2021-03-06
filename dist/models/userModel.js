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
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
class UserModel {
    constructor() {
        this.db = (0, promise_1.createPool)({
            host: "us-cdbr-east-03.cleardb.com",
            user: "b7231483ee9d9a",
            password: "9d11f609",
            database: "heroku_3eb19d65a2b4b11",
            connectionLimit: 1000,
        });
    }
    listarDeportes() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            let sports = yield connection.query("SELECT * FROM deporte");
            connection.release();
            return sports[0];
        });
    }
    listarUsuariosOwners() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            let owner = yield connection.query("SELECT id,usuario, elo, email FROM usuario");
            connection.release();
            return owner[0];
        });
    }
    listarPartidosActivos() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const partidos = yield connection.query("SELECT * FROM matchinfo where idEstadoPartido=1 and fechaHasta >now()");
            connection.release();
            return partidos[0];
        });
    }
    listarPartidosCreados(idUsuarioOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const partidoCreado = yield connection.query("SELECT * FROM partido where idEstadoPartido=1 and idUsuarioOwner = ?", [idUsuarioOwner]);
            connection.release();
            return partidoCreado[0];
        });
    }
    listar() {
        return __awaiter(this, void 0, void 0, function* () {
            //Devuelve todas las filas de la tabla usuario
            //const db=this.connection;
            const connection = yield this.db.getConnection();
            const usuarios = yield connection.query("SELECT * FROM usuario");
            connection.release();
            //console.log(usuarios[0]);
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return usuarios[0];
        });
    }
    //Devuelve un objeto cuya fila en la tabla usuarios coincide con id.
    //Si no la encuentra devuelve null
    buscarId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const encontrado = yield connection.query("SELECT * FROM usuario WHERE id = ?", [id]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            connection.release();
            return null;
        });
    }
    //Devuelve un objeto cuya fila en la tabla usuarios coincide con nombre.
    //Si no la encuentra devuelve null
    buscarNombre(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const encontrado = yield connection.query("SELECT * FROM usuario WHERE usuario = ?", [usuario]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            connection.release();
            return null;
        });
    }
    buscarMail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const encontrado = yield connection.query("SELECT * FROM usuario WHERE email = ?", [email]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            connection.release();
            return null;
        });
    }
    //Devuelve 1 si logro crear un nuevo usuario de la tabla usuarios
    crear(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const result = JSON.parse(JSON.stringify(yield connection.query("INSERT INTO usuario SET ?", [usuario])))[0].affectedRows; //@ts-ignore
            console.log(result);
            connection.release();
            return result;
        });
    }
    //Devuelve 1 si logro actualizar el usuario indicado por id
    actualizar(usuario, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const result = JSON.parse(JSON.stringify(yield connection.query("UPDATE usuario SET ? WHERE ID = ?", [
                usuario,
                id,
            ])))[0].affectedRows; //@ts-ignore
            connection.release();
            console.log(result);
            return result;
        });
    }
    //Devuelve 1 si logro eliminar el usuario indicado por id
    eliminar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const user = JSON.parse(JSON.stringify(yield connection.query("DELETE FROM usuario WHERE ID = ?", [id])))[0].affectedRows; //@ts-ignore
            connection.release();
            console.log(user);
            return user;
        });
    }
    creatematch(match, number) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const result = JSON.parse(JSON.stringify(yield connection.query("INSERT INTO partido (nombrePartido, idUsuarioOwner, fechaDesde, fechaHasta, idEstadoPartido, direccion, idDeporte, jugadoresFaltantes) VALUES  (?,?,?,?,?,?,?,?)", [
                match.nombrePartido,
                number,
                Date.now(),
                match.fechaHasta,
                1,
                match.direccion,
                Number(match.selectedSport),
                match.jugadoresFaltantes,
            ])))[0].affectedRows; //@ts-ignore
            connection.release();
            return result;
        });
    }
    joinmatch(idpartido, idusuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const partido = yield connection.query("INSERT INTO `heroku_3eb19d65a2b4b11`.`partidousuario` (`idPartido`, `idUsuario`) VALUES ('?', '?')", [idpartido, idusuario]);
            yield connection.query("UPDATE `heroku_3eb19d65a2b4b11`.`partido` SET jugadoresFaltantes = jugadoresFaltantes - 1 WHERE id = ?", [idpartido]);
            connection.release();
            return { success: true };
        });
    }
    isjoined(idpartido, idusuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const encontrado = yield connection.query("SELECT * FROM `heroku_3eb19d65a2b4b11`.`partidousuario` WHERE idPartido = ? AND idUsuario = ?", [idpartido, idusuario]);
            connection.release();
            return encontrado[0].length >= 1 ? true : false;
        });
    }
    showmatchinfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const partido = yield connection.query("SELECT * FROM matchinfo WHERE id = ?", [id]);
            let partido_users = yield connection.query("SELECT * FROM partidonombreusuariolt5 WHERE idpartido = ?", [id]);
            //@ts-ignore
            let result = partido[0][0];
            //@ts-ignore
            result = Object.assign(Object.assign({}, result), { users: partido_users[0] });
            console.log("UUUUUUUUUUUUUUUUUUUUUUU", result);
            connection.release();
            return result;
        });
    }
}
//Exportamos el enrutador con
const userModel = new UserModel();
exports.default = userModel;
//# sourceMappingURL=userModel.js.map
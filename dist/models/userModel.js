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
        this.config(); //aplicamos la conexion con la BD.
    }
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            //Parametro de conexion con la BD.
            this.db = yield (0, promise_1.createPool)({
                host: "us-cdbr-east-03.cleardb.com",
                user: "b7231483ee9d9a",
                password: "9d11f609",
                database: "heroku_3eb19d65a2b4b11",
                connectionLimit: 50,
            });
        });
    }
    listarDeportes() {
        return __awaiter(this, void 0, void 0, function* () {
            let sports = yield this.db.query("SELECT * FROM deporte");
            return sports[0];
        });
    }
    listarUsuariosOwners() {
        return __awaiter(this, void 0, void 0, function* () {
            let owner = yield this.db.query("SELECT id,usuario, elo, email FROM usuario");
            return owner[0];
        });
    }
    listarPartidosActivos() {
        return __awaiter(this, void 0, void 0, function* () {
            //!      OPTIMIZAR CON UNA VIEW EN DB
            //!---------------------------------------------
            /*
            const sports = await this.listarDeportes()
            const users = await this.listarUsuariosOwners()
            */
            //!---------------------------------------------
            /*
            const partidos = await this.db.query(
                "SELECT * FROM partido where idEstadoPartido=1 and fechaHasta >now() and jugadoresFaltantes>0 and idEstadoPartido=1"
            )
                
            partidos[0] = partidos[0].map(
                (partido: {
                    idUsuarioOwner: string | number
                    idDeporte: string | number
                }) => {
                    let sport = sports.filter(
                        (sport: { id: number | string }) =>
                            sport.id == partido.idDeporte
                    )
    
                    let owner = users.filter(
                        (user: { id: number | string }) =>
                            user.id == partido.idUsuarioOwner
                    )
    
                    sport = sport[0]
                    owner = owner[0]
    
                    return {
                        ...partido,
                        ownerInfo: { ...owner },
                        sportInfo: { ...sport },
                    }
                }
            )
                
            return partidos[0] */
            const partidos = yield this.db.query("SELECT * FROM matchinfo where idEstadoPartido=1 and fechaHasta >now() and jugadoresFaltantes>0");
            return partidos[0];
        });
    }
    listarPartidosCreados(idUsuarioOwner) {
        return __awaiter(this, void 0, void 0, function* () {
            const partidoCreado = yield this.db.query("SELECT * FROM partido where idEstadoPartido=1 and idUsuarioOwner = ?", [idUsuarioOwner]);
            return partidoCreado[0];
        });
    }
    listar() {
        return __awaiter(this, void 0, void 0, function* () {
            //Devuelve todas las filas de la tabla usuario
            //const db=this.connection;
            const usuarios = yield this.db.query("SELECT * FROM usuario");
            //console.log(usuarios[0]);
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return usuarios[0];
        });
    }
    //Devuelve un objeto cuya fila en la tabla usuarios coincide con id.
    //Si no la encuentra devuelve null
    buscarId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query("SELECT * FROM usuario WHERE id = ?", [id]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    //Devuelve un objeto cuya fila en la tabla usuarios coincide con nombre.
    //Si no la encuentra devuelve null
    buscarNombre(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query("SELECT * FROM usuario WHERE usuario = ?", [usuario]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    buscarMail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query("SELECT * FROM usuario WHERE email = ?", [email]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    //Devuelve 1 si logro crear un nuevo usuario de la tabla usuarios
    crear(usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query("INSERT INTO usuario SET ?", [usuario]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    //Devuelve 1 si logro actualizar el usuario indicado por id
    actualizar(usuario, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query("UPDATE usuario SET ? WHERE ID = ?", [
                usuario,
                id,
            ]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    //Devuelve 1 si logro eliminar el usuario indicado por id
    eliminar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield this.db.query("DELETE FROM usuario WHERE ID = ?", [id]))[0].affectedRows;
            console.log(user);
            return user;
        });
    }
    creatematch(match, number) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query("INSERT INTO partido (nombrePartido, idUsuarioOwner, fechaDesde, fechaHasta, idEstadoPartido, direccion, idDeporte, jugadoresFaltantes) VALUES  (?,?,?,?,?,?,?,?)", [
                match.nombrePartido,
                number,
                Date.now(),
                match.fechaHasta,
                1,
                match.direccion,
                Number(match.selectedSport),
                match.jugadoresFaltantes,
            ]))[0].affectedRows;
            return result;
        });
    }
    showmatchinfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id);
            const partido = yield this.db.query("SELECT * FROM matchinfo WHERE id = ?", [id]);
            const result = partido[0][0];
            return result;
        });
    }
}
//Exportamos el enrutador con
const userModel = new UserModel();
exports.default = userModel;
//# sourceMappingURL=userModel.js.map
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
class AdminModel {
    constructor() {
        this.db = (0, promise_1.createPool)({
            host: "us-cdbr-east-03.cleardb.com",
            user: "b7231483ee9d9a",
            password: "9d11f609",
            database: "heroku_3eb19d65a2b4b11",
            connectionLimit: 1000,
        });
    }
    listararticulos() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.db.getConnection();
            const articulos = yield connection.query("SELECT * FROM variedades");
            //console.log(usuarios[0]);
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            connection.release();
            return articulos[0];
        });
    }
    listarpedidos() {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.db.getConnection();
            const articulos = yield connection.query("SELECT * FROM pedidos");
            connection.release();
            return articulos[0];
        });
    }
    crear(descripcion, precio) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.db.getConnection();
            const result = JSON.parse(JSON.stringify(yield connection.query("INSERT INTO variedades (nombre, precio) values(?, ?)", [descripcion, precio])))[0].affectedRows;
            connection.release();
            console.log(result);
            return result;
        });
    }
    actualizar(id, descripcion, precio) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.db.getConnection();
            const result = JSON.parse(JSON.stringify(yield connection.query("UPDATE variedades SET nombre = ?, precio = ?  WHERE ID = ?", [descripcion, precio, id])))[0].affectedRows;
            connection.release();
            console.log(result);
            return result;
        });
    }
    eliminar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.db.getConnection();
            const art = JSON.parse(JSON.stringify(yield connection.query("DELETE FROM variedades WHERE ID = ?", [
                id,
            ])))[0].affectedRows;
            connection.release();
            return art;
        });
    }
    buscarNombre(descripcion) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.db.getConnection();
            const encontrado = yield connection.query("SELECT * FROM variedades WHERE nombre = ?", [descripcion]);
            if (encontrado.length > 1)
                return encontrado[0][0];
            connection.release();
            return null;
        });
    }
}
const adminModel = new AdminModel();
exports.default = adminModel;
//# sourceMappingURL=adminModel.js.map
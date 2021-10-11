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
class CompraModel {
    constructor() {
        this.db = (0, promise_1.createPool)({
            host: "us-cdbr-east-03.cleardb.com",
            user: "b7231483ee9d9a",
            password: "9d11f609",
            database: "heroku_3eb19d65a2b4b11",
            connectionLimit: 1000,
        });
    }
    GuardarDatos(pedidos) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.db.getConnection();
            const result = JSON.parse(JSON.stringify(yield connection.query("INSERT INTO pedidos SET ?", [pedidos])))[0].insertId; //@ts-ignore //insertId devuelve ID generado con el INSERT
            connection.release();
            return result;
        });
    }
    GuardarPedidoArticulo(datosPedido) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.db.getConnection();
            const result = JSON.parse(JSON.stringify(yield connection.query("INSERT INTO pedidos_articulos SET ?", [
                datosPedido,
            ])))[0].affectedRows; //@ts-ignore //filas afectadas
            connection.release();
            return result;
        });
    }
}
const compraModel = new CompraModel();
exports.default = compraModel;
//# sourceMappingURL=compraModel.js.map
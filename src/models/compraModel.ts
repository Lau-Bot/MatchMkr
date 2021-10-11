import { createPool, Pool } from "mysql2/promise"

class CompraModel {
    private db: Pool
    constructor() {
        this.db = createPool({
            host: "us-cdbr-east-03.cleardb.com",
            user: "b7231483ee9d9a",
            password: "9d11f609",
            database: "heroku_3eb19d65a2b4b11",
            connectionLimit: 1000,
        })
    }

    async GuardarDatos(pedidos: object) {
        let connection = await this.db.getConnection()
        const result = JSON.parse(
            JSON.stringify(
                await connection.query("INSERT INTO pedidos SET ?", [pedidos])
            )
        )[0].insertId //@ts-ignore //insertId devuelve ID generado con el INSERT
        connection.release()
        return result
    }

    async GuardarPedidoArticulo(datosPedido: object) {
        let connection = await this.db.getConnection()
        const result = JSON.parse(
            JSON.stringify(
                await connection.query("INSERT INTO pedidos_articulos SET ?", [
                    datosPedido,
                ])
            )
        )[0].affectedRows //@ts-ignore //filas afectadas
        connection.release()
        return result
    }
}

const compraModel: CompraModel = new CompraModel()
export default compraModel

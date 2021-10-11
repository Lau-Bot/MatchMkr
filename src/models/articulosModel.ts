import { createPool, Pool } from "mysql2/promise"

class ArticulosModel {
    private db: any
    constructor() {
        this.db = createPool({
            host: "us-cdbr-east-03.cleardb.com",
            user: "b7231483ee9d9a",
            password: "9d11f609",
            database: "heroku_3eb19d65a2b4b11",
            connectionLimit: 1000,
        })
    }

    async listar() {
        let connection = await this.db.getConnection()
        const articulos = await connection.query("SELECT * FROM variedades")
        connection.release
        return articulos[0]
    }
}

//Exportamos el enrutador con

const articulosModel: ArticulosModel = new ArticulosModel()
export default articulosModel

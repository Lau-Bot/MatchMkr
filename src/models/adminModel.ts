import { createPool, Pool } from "mysql2/promise"

class AdminModel {
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

    async listararticulos() {
        const connection = await this.db.getConnection()
        const articulos = await connection.query("SELECT * FROM variedades")
        //console.log(usuarios[0]);
        //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
        connection.release()
        return articulos[0]
    }

    async listarpedidos() {
        let connection = await this.db.getConnection()
        const articulos = await connection.query("SELECT * FROM pedidos")
        connection.release()
        return articulos[0]
    }

    async crear(descripcion: string, precio: number) {
        let connection = await this.db.getConnection()
        const result = JSON.parse(
            JSON.stringify(
                await connection.query(
                    "INSERT INTO variedades (nombre, precio) values(?, ?)",
                    [descripcion, precio]
                )
            )
        )[0].affectedRows
        connection.release()
        console.log(result)
        return result
    }

    async actualizar(id: string, descripcion: string, precio: number) {
        let connection = await this.db.getConnection()
        const result = JSON.parse(
            JSON.stringify(
                await connection.query(
                    "UPDATE variedades SET nombre = ?, precio = ?  WHERE ID = ?",
                    [descripcion, precio, id]
                )
            )
        )[0].affectedRows
        connection.release()
        console.log(result)
        return result
    }

    async eliminar(id: string) {
        let connection = await this.db.getConnection()
        const art = JSON.parse(
            JSON.stringify(
                await connection.query("DELETE FROM variedades WHERE ID = ?", [
                    id,
                ])
            )
        )[0].affectedRows
        connection.release()
        return art
    }

    async buscarNombre(descripcion: string) {
        let connection = await this.db.getConnection()
        const encontrado: any = await connection.query(
            "SELECT * FROM variedades WHERE nombre = ?",
            [descripcion]
        )
        if (encontrado.length > 1) return encontrado[0][0]
        connection.release()
        return null
    }
}

const adminModel: AdminModel = new AdminModel()
export default adminModel

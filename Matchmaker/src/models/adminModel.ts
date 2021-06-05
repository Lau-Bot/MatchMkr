import { createPool } from 'mysql2/promise';


class AdminModel {
    private db: any;
    constructor() {
        this.config(); //aplicamos la conexion con la BD.
    }

    async config() {//Parametro de conexion con la BD.
        this.db = await createPool({
            host: "us-cdbr-east-03.cleardb.com",
            user: "b7231483ee9d9a",
            password: "9d11f609",
            database: "heroku_3eb19d65a2b4b11",
            connectionLimit: 10,
        });
    }

    async listararticulos() {
        const articulos = await this.db.query('SELECT * FROM variedades');
        //console.log(usuarios[0]);
        //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
        return articulos[0];
    }

    async listarpedidos() {
        const articulos = await this.db.query('SELECT * FROM pedidos');

        return articulos[0];
    }

    async crear(descripcion: string, precio: number) {
        const result = (await this.db.query("INSERT INTO variedades (nombre, precio) values(?, ?)", [descripcion, precio]))[0].affectedRows;
        console.log(result);
        return result;
    }

    async actualizar(id: string, descripcion: string, precio: number) {
        const result = (await this.db.query('UPDATE variedades SET nombre = ?, precio = ?  WHERE ID = ?', [descripcion, precio, id]))[0].affectedRows;
        console.log(result);
        return result;
    }

    async eliminar(id: string) {
        const art = (await this.db.query('DELETE FROM variedades WHERE ID = ?', [id]))[0].affectedRows;
        return art;
    }

    async buscarNombre(descripcion: string) {
        const encontrado: any = await this.db.query('SELECT * FROM variedades WHERE nombre = ?', [descripcion]);
        if (encontrado.length > 1)
            return encontrado[0][0];
        return null;
    }

}




const adminModel: AdminModel = new AdminModel();
export default adminModel;
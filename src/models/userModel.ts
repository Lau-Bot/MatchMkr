import { createPool, Pool } from "mysql2/promise"
import { PartiallyEmittedExpression } from "typescript"

interface matchInterface {
    nombrePartido: string
    direccion: string
    fechaHasta: string
    selectedSport: string | number
    jugadoresFaltantes: number
}

class UserModel {
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

    async listarDeportes() {
        const connection = await this.db.getConnection()
        let sports = await connection.query("SELECT * FROM deporte")
        connection.release()
        return sports[0]
    }

    async listarUsuariosOwners() {
        const connection = await this.db.getConnection()
        let owner = await connection.query(
            "SELECT id,usuario, elo, email FROM usuario"
        )
        connection.release()
        return owner[0]
    }
    async listarPartidosActivos() {
        const connection = await this.db.getConnection()
        const partidos = await connection.query(
            "SELECT * FROM matchinfo where idEstadoPartido=1 and fechaHasta >now()"
        )
        connection.release()
        return partidos[0]
    }
    async listarPartidosCreados(idUsuarioOwner: number) {
        const connection = await this.db.getConnection()
        const partidoCreado = await connection.query(
            "SELECT * FROM partido where idEstadoPartido=1 and idUsuarioOwner = ?",
            [idUsuarioOwner]
        )
        connection.release()
        return partidoCreado[0]
    }

    async listar() {
        //Devuelve todas las filas de la tabla usuario
        //const db=this.connection;
        const connection = await this.db.getConnection()
        const usuarios = await connection.query("SELECT * FROM usuario")
        connection.release()
        //console.log(usuarios[0]);
        //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
        return usuarios[0]
    }

    //Devuelve un objeto cuya fila en la tabla usuarios coincide con id.
    //Si no la encuentra devuelve null
    async buscarId(id: string) {
        const connection = await this.db.getConnection()
        const encontrado: any = await connection.query(
            "SELECT * FROM usuario WHERE id = ?",
            [id]
        )
        //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
        if (encontrado.length > 1) return encontrado[0][0]
        connection.release()
        return null
    }
    //Devuelve un objeto cuya fila en la tabla usuarios coincide con nombre.
    //Si no la encuentra devuelve null
    async buscarNombre(usuario: string) {
        const connection = await this.db.getConnection()
        const encontrado: any = await connection.query(
            "SELECT * FROM usuario WHERE usuario = ?",
            [usuario]
        )
        //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
        if (encontrado.length > 1) return encontrado[0][0]
        connection.release()
        return null
    }

    async buscarMail(email: string) {
        const connection = await this.db.getConnection()
        const encontrado: any = await connection.query(
            "SELECT * FROM usuario WHERE email = ?",
            [email]
        )
        //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
        if (encontrado.length > 1) return encontrado[0][0]
        connection.release()
        return null
    }

    //Devuelve 1 si logro crear un nuevo usuario de la tabla usuarios
    async crear(usuario: object) {
        const connection = await this.db.getConnection()
        const result = JSON.parse(
            JSON.stringify(
                await connection.query("INSERT INTO usuario SET ?", [usuario])
            )
        )[0].affectedRows //@ts-ignore
        console.log(result)
        connection.release()
        return result
    }

    //Devuelve 1 si logro actualizar el usuario indicado por id
    async actualizar(usuario: object, id: string) {
        const connection = await this.db.getConnection()
        const result = JSON.parse(
            JSON.stringify(
                await connection.query("UPDATE usuario SET ? WHERE ID = ?", [
                    usuario,
                    id,
                ])
            )
        )[0].affectedRows //@ts-ignore
        connection.release()
        console.log(result)
        return result
    }

    //Devuelve 1 si logro eliminar el usuario indicado por id
    async eliminar(id: string) {
        const connection = await this.db.getConnection()
        const user = JSON.parse(
            JSON.stringify(
                await connection.query("DELETE FROM usuario WHERE ID = ?", [id])
            )
        )[0].affectedRows //@ts-ignore
        connection.release()
        console.log(user)
        return user
    }

    async creatematch(match: matchInterface, number: number) {
        const connection = await this.db.getConnection()
        const result = JSON.parse(
            JSON.stringify(
                await connection.query(
                    "INSERT INTO partido (nombrePartido, idUsuarioOwner, fechaDesde, fechaHasta, idEstadoPartido, direccion, idDeporte, jugadoresFaltantes) VALUES  (?,?,?,?,?,?,?,?)",
                    [
                        match.nombrePartido,
                        number,
                        Date.now(),
                        match.fechaHasta,
                        1,
                        match.direccion,
                        Number(match.selectedSport),
                        match.jugadoresFaltantes,
                    ]
                )
            )
        )[0].affectedRows //@ts-ignore
        connection.release()
        return result
    }

    async joinmatch(idpartido: number, idusuario: number) {
        const connection = await this.db.getConnection()
        const partido = await connection.query(
            "INSERT INTO `heroku_3eb19d65a2b4b11`.`partidousuario` (`idPartido`, `idUsuario`) VALUES ('?', '?')",
            [idpartido, idusuario]
        )
        await connection.query(
            "UPDATE `heroku_3eb19d65a2b4b11`.`partido` SET jugadoresFaltantes = jugadoresFaltantes - 1 WHERE id = ?",
            [idpartido]
        )
        connection.release()
        return { success: true }
    }

    async isjoined(idpartido: number, idusuario: number) {
        const connection = await this.db.getConnection()
        const encontrado: any = await connection.query(
            "SELECT * FROM `heroku_3eb19d65a2b4b11`.`partidousuario` WHERE idPartido = ? AND idUsuario = ?",
            [idpartido, idusuario]
        )

        connection.release()
        return encontrado[0].length >= 1 ? true : false
    }

    async showmatchinfo(id: string) {
        const connection = await this.db.getConnection()
        const partido = await connection.query(
            "SELECT * FROM matchinfo WHERE id = ?",
            [id]
        )

        let partido_users = await connection.query(
            "SELECT * FROM partidonombreusuariolt5 WHERE idpartido = ?",
            [id]
        )

        //@ts-ignore
        let result = partido[0][0]
        //@ts-ignore

        result = { ...result, users: partido_users[0] }
        console.log("UUUUUUUUUUUUUUUUUUUUUUU", result)
        connection.release()
        return result
    }
}

//Exportamos el enrutador con

const userModel: UserModel = new UserModel()
export default userModel

import { createPool } from "mysql2/promise";

interface matchInterface {
    nombrePartido: string;
    direccion: string;
    fechaHasta: string;
    selectedSport: string | number;
    jugadoresFaltantes: number;
}

class UserModel {
    private db: any;
    constructor() {
        this.config(); //aplicamos la conexion con la BD.
    }

    async config() {
        //Parametro de conexion con la BD.
        this.db = await createPool({
            host: "us-cdbr-east-03.cleardb.com",
            user: "b7231483ee9d9a",
            password: "9d11f609",
            database: "heroku_3eb19d65a2b4b11",
            connectionLimit: 50,
        });
    }

    async listarDeportes() {
        let sports = await this.db.query("SELECT * FROM deporte");
        return sports[0];
    }

    async listarUsuariosOwners() {
        let owner = await this.db.query(
            "SELECT id,usuario, elo, email FROM usuario"
        );
        return owner[0];
    }
    async listarPartidosActivos() {
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

        const partidos = await this.db.query(
            "SELECT * FROM matchinfo where idEstadoPartido=1 and fechaHasta >now() and jugadoresFaltantes>0"
        );

        return partidos[0];
    }
    async listarPartidosCreados(idUsuarioOwner: number) {
        const partidoCreado = await this.db.query(
            "SELECT * FROM partido where idEstadoPartido=1 and idUsuarioOwner = ?",
            [idUsuarioOwner]
        );
        return partidoCreado[0];
    }

    async listar() {
        //Devuelve todas las filas de la tabla usuario
        //const db=this.connection;
        const usuarios = await this.db.query("SELECT * FROM usuario");
        //console.log(usuarios[0]);
        //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
        return usuarios[0];
    }

    //Devuelve un objeto cuya fila en la tabla usuarios coincide con id.
    //Si no la encuentra devuelve null
    async buscarId(id: string) {
        const encontrado: any = await this.db.query(
            "SELECT * FROM usuario WHERE id = ?",
            [id]
        );
        //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
        if (encontrado.length > 1) return encontrado[0][0];
        return null;
    }
    //Devuelve un objeto cuya fila en la tabla usuarios coincide con nombre.
    //Si no la encuentra devuelve null
    async buscarNombre(usuario: string) {
        const encontrado: any = await this.db.query(
            "SELECT * FROM usuario WHERE usuario = ?",
            [usuario]
        );
        //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
        if (encontrado.length > 1) return encontrado[0][0];
        return null;
    }

    async buscarMail(email: string) {
        const encontrado: any = await this.db.query(
            "SELECT * FROM usuario WHERE email = ?",
            [email]
        );
        //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
        if (encontrado.length > 1) return encontrado[0][0];
        return null;
    }

    //Devuelve 1 si logro crear un nuevo usuario de la tabla usuarios
    async crear(usuario: object) {
        const result = (
            await this.db.query("INSERT INTO usuario SET ?", [usuario])
        )[0].affectedRows;
        console.log(result);
        return result;
    }

    //Devuelve 1 si logro actualizar el usuario indicado por id
    async actualizar(usuario: object, id: string) {
        const result = (
            await this.db.query("UPDATE usuario SET ? WHERE ID = ?", [
                usuario,
                id,
            ])
        )[0].affectedRows;
        console.log(result);
        return result;
    }

    //Devuelve 1 si logro eliminar el usuario indicado por id
    async eliminar(id: string) {
        const user = (
            await this.db.query("DELETE FROM usuario WHERE ID = ?", [id])
        )[0].affectedRows;
        console.log(user);
        return user;
    }

    async creatematch(match: matchInterface, number: number) {
        const result = (
            await this.db.query(
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
        )[0].affectedRows;
        return result;
    }

    async showmatchinfo(id: string) {
        console.log(id);
        const partido = await this.db.query(
            "SELECT * FROM matchinfo WHERE id = ?",
            [id]
        );
        const result = partido[0][0];
        return result;
    }
}

//Exportamos el enrutador con

const userModel: UserModel = new UserModel();
export default userModel;

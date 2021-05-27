import { createPool } from 'mysql2/promise';

class ArticulosModel {
	private db: any;
	constructor() {
		this.config(); //aplicamos la conexion con la BD.
	}

	async config() {//Parametro de conexion con la BD.
		this.db = await createPool({
			host: 'localhost',
			user: 'root',
			password: '',
			database: 'pedidost2',
			connectionLimit: 10
		});
	}
	async listar() {
        const articulos=await this.db.query('SELECT * FROM variedades');
        return articulos[0];
    }
	
}

//Exportamos el enrutador con 

const articulosModel: ArticulosModel = new ArticulosModel();
export default articulosModel;
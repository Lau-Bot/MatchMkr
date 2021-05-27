import { createPool } from 'mysql2/promise';

class CompraModel {
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
	
	async GuardarDatos (pedidos:object){
		const result=(await this.db.query('INSERT INTO pedidos SET ?',[pedidos] ) ) [0].insertId; //insertId devuelve ID generado con el INSERT 
		return result;
		}

	async GuardarPedidoArticulo (datosPedido:object){
		const result=(await this.db.query('INSERT INTO pedidos_articulos SET ?', [datosPedido])) [0].affectedRows; //filas afectadas
		return result; 
		}

}

const compraModel: CompraModel = new CompraModel();
export default compraModel;
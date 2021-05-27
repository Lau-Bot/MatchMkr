import { Router, Request, Response } from 'express';
import compraController from '../controller/compraController';

class CompraRoutes{
	public router: Router = Router();
	constructor(){
		this.config();
	}
	config():void{
		this.router.get('/',(req:Request,res:Response)=> {
            res.send('Compra!');
            //res.render("partials/principal");
        });
		this.router.get('/listar',compraController.verCarrito);
		this.router.post('/confirmar',compraController.confirmar);
	}

    
}

//Exportamos el enrutador con 

const compraRoutes = new CompraRoutes();
export default compraRoutes.router;
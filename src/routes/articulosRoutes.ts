import { Router, Request, Response } from 'express';
import articulosController from '../controller/articulosController';
// import userController from '../controller/articulosController';

class ArticulosRoutes{
	public router: Router = Router();
	constructor(){
		this.config();
	}
	config():void{
		this.router.get('/',(req:Request,res:Response)=> {
            res.send('Articulos!');
            //res.render("partials/principal");
        });

	this.router.get('/listar',articulosController.listar);
	this.router.post('/comprar',articulosController.comprar);
    // this.router.get('/listarStock',articulosController.listarAndUpdate);
    // this.router.post('/modificar/:id',articulosController.modificar);
    // this.router.get('/modificando/:id',articulosController.modificando);
    // this.router.get('/eliminando/:id',articulosController.eliminando);
    // this.router.get('/agregar',articulosController.showaddProduct);
    // this.router.post('/agregar',articulosController.addProd);
       
	}   
}

//Exportamos el enrutador con 

const articulosRoutes = new ArticulosRoutes();
export default articulosRoutes.router;
import { Router, Request, Response } from 'express';
import adminController from '../controller/adminController';


class AdminRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.get('/', (req: Request, res: Response) => {
            res.send('Articulos!');
            //res.render("partials/principaasdl");
        });

        this.router.get('/home', adminController.home);

        this.router.get('/abmproductos', adminController.listar);

        this.router.get('/listarpedidos', adminController.listarpedidos);

        this.router.get("/delete/:id", adminController.delete);

        this.router.post("/agregar/", adminController.agregar);

        this.router.post("/modificar/:id", adminController.modificar);

        this.router.get('/error', adminController.showError);

        this.router.get('/salir', adminController.endSession);

    }
}

const adminRoutes = new AdminRoutes();
export default adminRoutes.router;
import { Router, Request, Response } from "express";
import userController from "../controller/userController";

class UserRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.get("/", (req: Request, res: Response) => {
            res.send("Main!!!");
        });

        this.router.get("/signin", userController.signin);
        this.router.post("/signin", userController.login);

        //registro
        this.router.get("/signup", userController.signup);
        this.router.post("/signup", userController.addUser);

        //Home del usuario
        //this.router.get("/home", userController.home);
        this.router.get("/home", userController.listarPartidosActivos);
        this.router.post("/home", userController.process);

        //CRUD
        {
            this.router.get("/list", userController.list);
            this.router.get("/find/:id", userController.find);
            this.router.post("/add", userController.addUser);
            this.router.put("/update/:id", userController.update);
            this.router.delete("/delete/:id", userController.delete);
            this.router.get("/delete/:id", userController.delete);
        }
        //FIN CRUD

        this.router.get("/controls", userController.control);
        this.router.post("/procesar", userController.procesar);

        // SALIR de la sesion
        this.router.get("/salir", userController.endSession);

        this.router.get("/error", userController.showError);

        this.router.get("/crearpartido", userController.showcreatematchpage);
        this.router.post("/crearpartido", userController.creatematch);

        this.router.get("/carrito", userController.listarPartidosCreados);
        this.router.get("/matchinfo/:id", userController.showmatchinfo);
    }
}

//Exportamos el enrutador con

const userRoutes = new UserRoutes();
export default userRoutes.router;

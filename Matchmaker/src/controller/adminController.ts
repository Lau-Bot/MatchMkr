import { Request, Response } from 'express';
import adminModel from '../models/adminModel';



class AdminController {



    public home(req: Request, res: Response) {
        console.log(req.body);
        if (!req.session.auth) {
            req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
            res.redirect("./error");
            // res.redirect("/");
        }
        if (!req.session.adminkey) {
            req.flash("error_session", "No sos un administrador !!! :(");
            res.redirect("./error");
            //res.redirect("/");
        }

        //res.send('Bienvenido!!!');
        //res.render("partials/home");
        res.render("partials/homeAdmin", { mi_session: true });
    }

    public async listar(req: Request, res: Response) {
        if (!req.session.auth) {
            req.flash("error_session", "Debes iniciar sesion para ver esta seccion");
            res.redirect("/user/signin");
        }
        if (!req.session.adminkey) {
            req.flash("error_session", "No sos un administrador !!! :(");
            res.redirect("./error");
            //res.redirect("/");
        }
        const articulos = await adminModel.listararticulos();
        return res.render("partials/abmproductos", { articulos, mi_session: true });
    }

    public async listarpedidos(req: Request, res: Response) {
        if (!req.session.auth) {
            req.flash("error_session", "Debes iniciar sesion para ver esta seccion");
            res.redirect("/user/signin");
        }
        if (!req.session.adminkey) {
            req.flash("error_session", "No sos un administrador !!! :(");
            res.redirect("./error");
            //res.redirect("/");
        }
        const pedidos = await adminModel.listarpedidos();
        return res.render("partials/listarpedidos", { pedidos, mi_session: true });
    }

    public async agregar(req: Request, res: Response) {
        const { descripcion, precio } = req.body;
        console.log(req.body);

        const busqueda = await adminModel.buscarNombre(descripcion);
        if (!busqueda) {
            const result = await adminModel.crear(descripcion, precio);
        }
        req.flash("Articulo_Agregado", "Se ha agregado el articulo");

        res.redirect("../abmproductos");

    }

    public async modificar(req: Request, res: Response) {
        const { id, nombre, precio } = req.body;
        console.log(req.body);
        const result = await adminModel.actualizar(id, nombre, precio);
        req.flash("Articulo_Modificado", "Se ha modificado el articulo");
        res.redirect("../abmproductos");

    }

    public async delete(req: Request, res: Response) {
        console.log(req.body);
        const { id } = req.params;
        const articulos = await adminModel.eliminar(id);
        req.flash("Articulo_Eliminado", "Se ha eliminado el articulo");
        res.redirect("../abmproductos");
    }

    public endSession(req: Request, res: Response) {
        console.log(req.body);
        req.session.user = {};
        req.session.auth = false;
        req.session.destroy(() => console.log("Session finalizada"));
        res.redirect("/");
    }

    public showError(req: Request, res: Response) {
        // res.send({ "Usuario y/o contraseña incorrectos": req.body });
        res.render("partials/error");
    }


}

const adminController = new AdminController();
export default adminController;
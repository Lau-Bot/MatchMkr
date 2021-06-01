import { Request, Response } from 'express';
import userModel from '../models/userModel';

import flash from "connect-flash";

// const listado = [
// 	{ "id": "1", "usuario": "Juan Perez", "password": "123456" },
// 	{ "id": "2", "usuario": "Pepe Cadena", "password": "123456" },
// 	{ "id": "3", "usuario": "Martin Gonzalez", "password": "123456" }
// ];


class UserController {

    public signin(req: Request, res: Response) {
        console.log(req.body);
        //res.send('Sign In!!!');
        res.render("partials/signinForm");
    }

    public async login(req: Request, res: Response) {
        const { usuario, password } = req.body; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.buscarNombre(usuario);
        console.log(usuario);
        console.log(password);
        console.log(result);

        if (result?.usuario == usuario && result?.password == password && result?.rol == true) {
            req.session.user = result;
            req.session.auth = true;
            req.session.adminkey = true;
            req.session.userkey = result?.id;
            res.redirect("../admin/home");
            return;
        }
        else
            if (result?.usuario == usuario && result?.password == password) {
                req.session.user = result;
                req.session.auth = true;
                req.session.adminkey = false;
                req.session.userkey = result?.id;
                res.redirect("./home");

                return;
            }
        //res.send({ "Usuario y/o contraseña incorrectos": req.body });
        req.flash("error_session", "Usuario y/o Password Incorrectos");
        res.redirect("./error");
    }

    public showError(req: Request, res: Response) {
        // res.send({ "Usuario y/o contraseña incorrectos": req.body });
        res.render("partials/error");
    }

    //registro
    public signup(req: Request, res: Response) {
        console.log(req.body);
        //res.send('Sign Up!!!');
        res.render("partials/signupForm");
    }

    public home(req: Request, res: Response) {
        console.log(req.body);
        if (!req.session.auth) {
            req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
            res.redirect("./error");
            // res.redirect("/");
        }
        //res.send('Bienvenido!!!');
        //res.render("partials/home");
        res.render("partials/home", { mi_session: true });
    }

    public process(req: Request, res: Response) {
        console.log(req.body);
        res.send('Datos recibidos!!!');
        //res.render("partials/home",{listado});
    }

    //CRUD
    public async list(req: Request, res: Response) {
        console.log(req.body);
        const usuarios = await userModel.listar();
        console.log(usuarios);
        return res.json(usuarios);
        //res.send('Listado de usuarios!!!');

    }

    public async find(req: Request, res: Response) {
        console.log(req.params.id);
        const { id } = req.params;
        const usuario = await userModel.buscarId(id);
        if (usuario)
            return res.json(usuario);
        res.status(404).json({ text: "User doesn't exists" });
    }

    public async addUser(req: Request, res: Response) {
        const usuario = req.body;
        delete usuario.repassword;
        console.log(req.body);
        //res.send('Usuario agregado!!!');
        const busqueda = await userModel.buscarNombre(usuario.nombre);
        if (!busqueda) {
            const result = await userModel.crear(usuario);
            return res.json({ message: 'User saved!!' });
        }
        return res.json({ message: 'User exists!!' });
    }

    public async update(req: Request, res: Response) {
        console.log(req.body);
        const { id } = req.params;
        const result = await userModel.actualizar(req.body, id);
        //res.send('Usuario '+ req.params.id +' actualizado!!!');
        return res.json({ text: 'updating a user ' + id });
    }

    public async delete(req: Request, res: Response) {
        console.log(req.body);
        //res.send('Usuario '+ req.params.id +' Eliminado!!!');
        const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.eliminar(id);
        // return res.json({ text: 'deleting a user ' + id });
        res.redirect('../controls');
    }
    //FIN CRUD

    public async control(req: Request, res: Response) {
        if (!req.session.auth) {
            req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
            res.redirect("./error");
            // res.redirect("/");
        }
        //res.send('Controles');
        const usuarios = await userModel.listar();
        const users = usuarios;
        res.render('partials/controls', { users: usuarios, mi_session: true });
        //res.render('partials/controls', { users: {} });
    }

    public async procesar(req: Request, res: Response) {
        if (!req.session.auth) {
            req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
            res.redirect("./error");
            //res.redirect("/");
        }
        console.log(req.body);
        let usuario = req.body.usuario;
        var usuarios: any = [];
        console.log(usuario);
        // if(usuario.length>0){
        if (usuario != undefined) {
            for (let elemento of usuario) {
                const encontrado = await userModel.buscarId(elemento);
                if (encontrado) {
                    usuarios.push(encontrado);
                    console.log(encontrado);
                }

            }
        }
        console.log(usuarios);

        res.render("partials/seleccion", { usuarios, home: req.session.user, mi_session: true });

        res.render('partials/procesar');
    }

    public endSession(req: Request, res: Response) {
        console.log(req.body);
        req.session.user = {};
        req.session.auth = false;
        req.session.adminkey = false;
        req.session.destroy(() => console.log("Session finalizada"));
        res.redirect("/");
    }

    public showcreatematchpage(req: Request, res: Response) {
        if (!req.session.auth) {
            req.flash('error_session', 'Debes iniciar sesion para crear un partido');
            res.redirect("./error");
            //res.redirect("/");
        }
        console.log(req.body);
        res.render("partials/creatematch");

    }

    public async creatematch(req: Request, res: Response) {
        const match = req.body;
        console.log(req.body);
        const idOwner = req.session.userkey;
        await userModel.creatematch(match, idOwner);
    }
}
const userController = new UserController();
export default userController;
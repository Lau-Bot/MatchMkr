import { Request, Response } from "express"
import userModel from "../models/userModel"
import flash from "connect-flash"

interface partidoInterface {
    id: number
    nombrePartido: string
    idUsuarioOwner: number
    fechaDesde: Date
    fechaHasta: any | Date
    idEstadoPartido: number
    direccion: string
    idDeporte: number
    jugadoresFaltantes: number
}

class UserController {
    public signin(req: Request, res: Response) {
        console.log(req.body)
        res.render("partials/signinForm")
    }

    public async login(req: Request, res: Response) {
        const { usuario, password } = req.body // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.buscarNombre(usuario)
        console.log(usuario)
        console.log(password)
        console.log(result)

        if (
            result?.usuario == usuario &&
            result?.password == password &&
            result?.rol == true
        ) {
            req.session.user = result
            req.session.auth = true
            req.session.adminkey = true
            req.session.userkey = result?.id
            res.redirect("../admin/home")
            return
        } else if (result?.usuario == usuario && result?.password == password) {
            req.session.user = result
            req.session.auth = true
            req.session.adminkey = false
            req.session.userkey = result?.id
            res.redirect("./home")

            return
        }
        //res.send({ "Usuario y/o contraseña incorrectos": req.body });
        req.flash("error_session", "Usuario y/o Password Incorrectos")
        res.redirect("./error")
    }

    public showError(req: Request, res: Response) {
        // res.send({ "Usuario y/o contraseña incorrectos": req.body });
        res.render("partials/alert", {
            alert_title: "Error",
            alert_body: "Debes iniciar sesion para crear un partido",
            gologin: true,
        })
    }

    //registro
    public signup(req: Request, res: Response) {
        console.log(req.body)
        //res.send('Sign Up!!!');
        res.render("partials/signupForm")
    }

    public home(req: Request, res: Response) {
        console.log(req.body)
        if (!req.session.auth) {
            req.flash(
                "error_session",
                "Debes iniciar sesion para ver esta seccion"
            )
            res.redirect("./error")
            // res.redirect("/");
        }
        //res.send('Bienvenido!!!');
        //res.render("partials/home");
        res.render("partials/home", { mi_session: true })
    }

    public process(req: Request, res: Response) {
        console.log(req.body)
        res.send("Datos recibidos!!!")
        //res.render("partials/home",{listado});
    }

    //CRUD
    public async list(req: Request, res: Response) {
        console.log(req.body)
        const usuarios = await userModel.listar()
        console.log(usuarios)
        return res.json(usuarios)
        //res.send('Listado de usuarios!!!');
    }

    public async find(req: Request, res: Response) {
        console.log(req.params.id)
        const { id } = req.params
        const usuario = await userModel.buscarId(id)
        if (usuario) return res.json(usuario)
        res.status(404).json({ text: "User doesn't exists" })
    }

    public async addUser(req: Request, res: Response) {
        const usuario = req.body
        delete usuario.repassword
        console.log(req.body)
        //res.send('Usuario agregado!!!');
        const busqueda = await userModel.buscarNombre(usuario.usuario)
        const busquedaMail = await userModel.buscarMail(usuario.email)
        if (!busqueda && !busquedaMail) {
            const result = await userModel.crear(usuario)
            return res.render("partials/alert", {
                alert_title: "Usuario guardado",
                alert_body: "El usuario se ha creado correctamente!",
                gologin: true,
            })

            //return res.json({ message: "Usuario guardado" })
        }
        return res.render("partials/alert", {
            alert_title: "Error",
            alert_body:
                "El nombre de usuario o email elegidos ya estan en uso, por favor intente ingresar otro",
            gosignup: true,
        })
        //return res.json({ message: "Nombre de usuario o email en uso" })
    }

    public async update(req: Request, res: Response) {
        console.log(req.body)
        const { id } = req.params
        const result = await userModel.actualizar(req.body, id)
        //res.send('Usuario '+ req.params.id +' actualizado!!!');
        return res.json({ text: "updating a user " + id })
    }

    public async delete(req: Request, res: Response) {
        console.log(req.body)
        //res.send('Usuario '+ req.params.id +' Eliminado!!!');
        const { id } = req.params // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.eliminar(id)
        // return res.json({ text: 'deleting a user ' + id });
        res.redirect("../controls")
    }
    //FIN CRUD

    public async control(req: Request, res: Response) {
        if (!req.session.auth) {
            req.flash(
                "error_session",
                "Debes iniciar sesion para ver esta seccion"
            )
            res.redirect("./error")
            // res.redirect("/");
        }
        //res.send('Controles');
        const usuarios = await userModel.listar()
        const users = usuarios
        res.render("partials/controls", { users: usuarios, mi_session: true })
        //res.render('partials/controls', { users: {} });
    }

    public async procesar(req: Request, res: Response) {
        if (!req.session.auth) {
            req.flash(
                "error_session",
                "Debes iniciar sesion para ver esta seccion"
            )
            res.redirect("./error")
            //res.redirect("/");
        }
        console.log(req.body)
        let usuario = req.body.usuario
        var usuarios: any = []
        console.log(usuario)
        // if(usuario.length>0){
        if (usuario != undefined) {
            for (let elemento of usuario) {
                const encontrado = await userModel.buscarId(elemento)
                if (encontrado) {
                    usuarios.push(encontrado)
                    console.log(encontrado)
                }
            }
        }
        console.log(usuarios)

        res.render("partials/seleccion", {
            usuarios,
            home: req.session.user,
            mi_session: true,
        })

        res.render("partials/procesar")
    }

    public endSession(req: Request, res: Response) {
        console.log(req.body)
        req.session.user = {}
        req.session.auth = false
        req.session.adminkey = false
        req.session.destroy(() => console.log("Session finalizada"))
        res.redirect("/")
    }

    public showcreatematchpage(req: Request, res: Response) {
        if (!req.session.auth) {
            req.flash(
                "error_session",
                "Debes iniciar sesion para crear un partido"
            )
            res.redirect("./error")
            //res.redirect("/");
        }
        console.log(req.body)
        res.render("partials/creatematch")
    }

    public async creatematch(req: Request, res: Response) {
        const match = req.body
        console.log(req.body)
        const idOwner = req.session.userkey
        await userModel.creatematch(match, idOwner)
        //lo mando a carrito temporalmente para que no rompa
        res.render("partials/alert", {
            alert_title: "Partido Creado",
            alert_body: "Partido fue creado satisfactoriamente.",
            gohome: true,
        })
    }

    public async showmatchinfo(req: Request, res: Response) {
        if (!req.session.auth) {
            req.flash(
                "error_session",
                "Debes iniciar sesion para crear un partido"
            )
            res.redirect("./error")
            //res.redirect("/");
        }
        console.log(req.params.id)
        const { id } = req.params
        const matchinfo = await userModel.showmatchinfo(id)
        console.log(matchinfo)
        res.render("partials/matchinfo", {
            matchinfo: matchinfo,
        })
    }

    public async listarPartidosActivos(req: Request, res: Response) {
        if (!req.session.auth) {
            req.flash(
                "error_session",
                "Debes iniciar sesion para crear un partido"
            )
            res.redirect("./error")
            //res.redirect("/");
        }
        const partidos = await userModel.listarPartidosActivos()
        console.log("PARTIDOS!!!!!!! ", partidos)

        const partidosFinal = partidos.map((partido: partidoInterface) => {
            partido.fechaHasta = `
            ${
                partido.fechaHasta.getMonth() <= 9
                    ? "0" + partido.fechaHasta.getMonth()
                    : partido.fechaHasta.getMonth()
            }/${
                partido.fechaHasta.getDate() <= 9
                    ? "0" + partido.fechaHasta.getDate()
                    : partido.fechaHasta.getDate()
            }/${partido.fechaHasta.getFullYear()} - ${
                partido.fechaHasta.getHours() <= 9
                    ? "0" + partido.fechaHasta.getHours()
                    : partido.fechaHasta.getHours()
            }:${
                partido.fechaHasta.getMinutes() <= 9
                    ? "0" + partido.fechaHasta.getMinutes()
                    : partido.fechaHasta.getMinutes()
            }hs`
            return partido
        })
        return res.render("partials/home", {
            partidos: partidosFinal,
            mi_session: true,
        })
    }

    public async listarPartidosCreados(req: Request, res: Response) {
        if (!req.session.auth) {
            req.flash(
                "error_session",
                "Debes iniciar sesion para crear un partido"
            )
            res.redirect("./error")
            //res.redirect("/");
        }
        const match = req.body
        const idOwner = req.body.idUsuarioOwner
        console.log(req.body)
        console.log("este es el id owner: ", idOwner)
        const partidos = await userModel.listarPartidosCreados(idOwner)
        console.log(partidos)
        return res.render("partials/home", {
            partidos: partidos,
            mi_session: true,
        })
    }
}

const userController = new UserController()
export default userController

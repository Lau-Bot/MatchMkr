import { Request, Response } from 'express';
import articulosModel from '../models/articulosModel';

import flash from "connect-flash";


class ArticulosController {

	public async listar(req: Request, res: Response){
        if (!req.session.auth){
            req.flash("error_session", "Debes iniciar sesion para ver esta seccion");
            res.redirect("/user/signin");
        }
        const articulos = await articulosModel.listar();
        return res.render("partials/articulos", {articulos,mi_session:true});
    }
    public async comprar(req:Request,res:Response){
        if(!req.session.auth){  //protege la sesion si no es verdadera --> configurada en el loguin  
          return res.redirect("/"); 
          
        }
        //console.log (req.body);
        req.session.carrito.push({ /* variable semipermanente */
            "id":req.body.id,
            "nombre":req.body.nombre,
            "precio":req.body.precio,
            "cantidad":req.body.cantidad,
            "subtotal":req.body.precio * req.body.cantidad
        });
            req.session.total=req.session.total + (req.body.precio * req.body.cantidad);
            console.log(req.session.total);
            //console.log(req.session.carrito);   
            req.flash('confirmacion','El articulo ha sido agregado con éxito!!')
            res.redirect('./listar');
      }
}

const articulosController = new ArticulosController();
export default articulosController;

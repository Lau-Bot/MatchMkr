import { Request, Response } from 'express';
import  compraModel from '../models/compraModel';

import flash from "connect-flash";

// const listado = [
// 	{ "id": "1", "usuario": "Juan Perez", "password": "123456" },
// 	{ "id": "2", "usuario": "Pepe Cadena", "password": "123456" },
// 	{ "id": "3", "usuario": "Martin Gonzalez", "password": "123456" }
// ];


class CompraController {

    public listar(req:Request,res:Response){
        res.render("partials/carrito", {carrito:req.session.carrito, total:req.session.total} )
    }

    public verCarrito(req:Request,res:Response){
        if(!req.session.auth){  
             req.flash('error','Debe iniciar sesion para ver esta seccion');
			res.redirect("../user/signin");
            return res.redirect("/"); 
          }
          
        if(req.session.total==0){
            res.render("partials/carrito", {carrito:req.session.carrito, total:req.session.total} )
        }  
        else {
            res.render("partials/carrito", {carrito:req.session.carrito, total:req.session.total, flag:true } )
        }
    }
    public async confirmar(req:Request,res:Response){
        if(!req.session.auth){    
            return res.redirect("/"); 
          }
        let pedido_articulo=[];
        let entrega=req.body;
        const id=await compraModel.GuardarDatos(req.body); //toma pedido y lo guarda en la bd
        for (const i in req.session.carrito){
            pedido_articulo.push({
                "id_pedido":id,
                "id_articulo":req.session.carrito[i].id,
                "precio":req.session.carrito[i].precio,
                "cantidad":req.session.carrito[i].cantidad
            });
            await compraModel.GuardarPedidoArticulo(pedido_articulo[0]);
            pedido_articulo=[]; 
        };
        req.session.carrito=[];
        req.session.total=0;
        res.render('partials/pedidoOk',{pedido:id,compra:req.body, mi_session:true} );
    }

}

const compraController = new CompraController();
export default compraController;

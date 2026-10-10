import { Request, Response } from "express";

import {
  crearProductoSchema,
  actualizarProductoSchema,
  crearVarianteSchema
} from "../schemas/productos.schema.js";

import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  crearVariante
} from "../services/productos.service.js";


export async function obtenerProductos(
  req: Request,
  res: Response
) {

  try {

    const productos =
      await listarProductos();

    return res.json({
      ok: true,
      data: productos
    });

  } catch (error) {

    console.error(
      "Error al obtener productos:",
      error
    );

    return res.status(500).json({
      ok: false,
      message:
        "Error al obtener productos"
    });

  }

}


export async function registrarProducto(
  req: Request,
  res: Response
) {

  try {

    const validacion =
      crearProductoSchema.safeParse(
        req.body
      );

    if (!validacion.success) {

      return res.status(400).json({
        ok: false,
        message:
          "Datos del producto inválidos",
        errors:
          validacion.error.flatten()
      });

    }


    const producto =
      await crearProducto(
        validacion.data
      );


    return res.status(201).json({
      ok: true,
      message:
        "Producto registrado correctamente",
      data: producto
    });

  } catch (error) {

    console.error(
      "Error al registrar producto:",
      error
    );

    return res.status(500).json({
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al registrar producto"
    });

  }

}


export async function modificarProducto(
  req: Request,
  res: Response
) {

  try {

    const id =
      Number(req.params.id);


    const validacion =
      actualizarProductoSchema.safeParse(
        req.body
      );


    if (!validacion.success) {

      return res.status(400).json({
        ok: false,
        message:
          "Datos del producto inválidos",
        errors:
          validacion.error.flatten()
      });

    }


    const producto =
      await actualizarProducto(
        id,
        validacion.data
      );


    return res.json({
      ok: true,
      message:
        "Producto actualizado correctamente",
      data: producto
    });

  } catch (error) {

    console.error(
      "Error al actualizar producto:",
      error
    );

    return res.status(500).json({
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al actualizar producto"
    });

  }

}


export async function registrarVariante(
  req: Request,
  res: Response
) {

  try {

    const idProducto =
      Number(req.params.id);


    const validacion =
      crearVarianteSchema.safeParse(
        req.body
      );


    if (!validacion.success) {

      return res.status(400).json({
        ok: false,
        message:
          "Datos de la variante inválidos",
        errors:
          validacion.error.flatten()
      });

    }


    const variante =
      await crearVariante(
        idProducto,
        validacion.data
      );


    return res.status(201).json({
      ok: true,
      message:
        "Variante registrada correctamente",
      data: variante
    });

  } catch (error) {

    console.error(
      "Error al registrar variante:",
      error
    );

    return res.status(500).json({
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al registrar variante"
    });

  }

}
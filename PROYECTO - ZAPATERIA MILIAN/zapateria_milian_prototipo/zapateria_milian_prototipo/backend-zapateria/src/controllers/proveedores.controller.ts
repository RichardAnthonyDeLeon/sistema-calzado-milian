import type { Request, Response } from "express";

import {
  listarProveedores,
  crearProveedor,
  buscarProveedorPorId,
  actualizarProveedor
} from "../services/proveedores.service.js";

import {
  crearProveedorSchema,
  actualizarProveedorSchema
} from "../schemas/proveedores.schema.js";


export async function obtenerProveedores(
  req: Request,
  res: Response
) {

  try {

    const proveedores =
      await listarProveedores();

    return res.status(200).json({
      ok: true,
      data: proveedores,
    });

  } catch (error) {

    console.error(
      "Error al obtener proveedores:",
      error
    );

    return res.status(500).json({
      ok: false,
      message:
        "Error al obtener los proveedores",
    });

  }

}


export async function registrarProveedor(
  req: Request,
  res: Response
) {

  try {

    const validacion =
      crearProveedorSchema.safeParse(
        req.body
      );


    if (!validacion.success) {

      return res.status(400).json({

        ok: false,

        message:
          "Datos inválidos",

        errors:
          validacion.error.flatten(),

      });

    }


    const proveedor =
      await crearProveedor(
        validacion.data
      );


    return res.status(201).json({

      ok: true,

      message:
        "Proveedor registrado correctamente",

      data: proveedor,

    });


  } catch (error) {

    console.error(
      "Error al registrar proveedor:",
      error
    );

    return res.status(500).json({

      ok: false,

      message:
        "Error al registrar el proveedor",

    });

  }

}


export async function obtenerProveedorPorId(
  req: Request,
  res: Response
) {

  try {

    const id =
      Number(req.params.id);


    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {

      return res.status(400).json({

        ok: false,

        message:
          "El ID del proveedor no es válido",

      });

    }


    const proveedor =
      await buscarProveedorPorId(id);


    if (!proveedor) {

      return res.status(404).json({

        ok: false,

        message:
          "Proveedor no encontrado",

      });

    }


    return res.status(200).json({

      ok: true,

      data: proveedor,

    });


  } catch (error) {

    console.error(
      "Error al obtener proveedor:",
      error
    );

    return res.status(500).json({

      ok: false,

      message:
        "Error al obtener el proveedor",

    });

  }

}


export async function modificarProveedor(
  req: Request,
  res: Response
) {

  try {

    const id =
      Number(req.params.id);


    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {

      return res.status(400).json({

        ok: false,

        message:
          "El ID del proveedor no es válido",

      });

    }


    const validacion =
      actualizarProveedorSchema.safeParse(
        req.body
      );


    if (!validacion.success) {

      return res.status(400).json({

        ok: false,

        message:
          "Datos inválidos",

        errors:
          validacion.error.flatten(),

      });

    }


    const proveedorExistente =
      await buscarProveedorPorId(id);


    if (!proveedorExistente) {

      return res.status(404).json({

        ok: false,

        message:
          "Proveedor no encontrado",

      });

    }


    const proveedorActualizado =
      await actualizarProveedor(
        id,
        validacion.data
      );


    return res.status(200).json({

      ok: true,

      message:
        "Proveedor actualizado correctamente",

      data:
        proveedorActualizado,

    });


  } catch (error) {

    console.error(
      "Error al actualizar proveedor:",
      error
    );

    return res.status(500).json({

      ok: false,

      message:
        "Error al actualizar el proveedor",

    });

  }

}
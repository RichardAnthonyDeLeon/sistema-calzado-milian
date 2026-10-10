import type {
  Request,
  Response
} from "express";

import {
  listarMateriales,
  crearMaterial,
  buscarMaterialPorId,
  actualizarMaterial,
  registrarEntradaMaterial
} from "../services/materiales.service.js";

import {
  crearMaterialSchema,
  actualizarMaterialSchema,
  entradaMaterialSchema
} from "../schemas/materiales.schema.js";

export async function obtenerMateriales(
  req: Request,
  res: Response
) {

  try {

    const materiales =
      await listarMateriales();

    return res.status(200).json({
      ok: true,
      data: materiales
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      ok: false,
      message:
        "Error al obtener materiales"
    });

  }

}


export async function registrarMaterial(
  req: Request,
  res: Response
) {

  try {

    const validacion =
      crearMaterialSchema.safeParse(
        req.body
      );


    if (!validacion.success) {

      return res.status(400).json({
        ok: false,
        message: "Datos inválidos",
        errors:
          validacion.error.flatten()
      });

    }


    const material =
      await crearMaterial(
        validacion.data
      );


    return res.status(201).json({
      ok: true,
      message:
        "Material registrado correctamente",
      data: material
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      ok: false,
      message:
        "Error al registrar material"
    });

  }

}


export async function modificarMaterial(
  req: Request,
  res: Response
) {

  try {

    const id =
      Number(req.params.id);


    const validacion =
      actualizarMaterialSchema.safeParse(
        req.body
      );


    if (!validacion.success) {

      return res.status(400).json({
        ok: false,
        message: "Datos inválidos",
        errors:
          validacion.error.flatten()
      });

    }


    const existente =
      await buscarMaterialPorId(id);


    if (!existente) {

      return res.status(404).json({
        ok: false,
        message:
          "Material no encontrado"
      });

    }


    const material =
      await actualizarMaterial(
        id,
        validacion.data
      );


    return res.status(200).json({
      ok: true,
      message:
        "Material actualizado correctamente",
      data: material
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      ok: false,
      message:
        "Error al actualizar material"
    });

  }

}

export async function crearEntradaMaterial(
  req: Request,
  res: Response
) {

  try {

    const validacion =
      entradaMaterialSchema.safeParse(
        req.body
      );


    if (!validacion.success) {

      return res.status(400).json({

        ok: false,

        message:
          "Datos de entrada inválidos",

        errors:
          validacion.error.flatten()

      });

    }


    const resultado =
      await registrarEntradaMaterial(
        validacion.data
      );


    return res.status(201).json({

      ok: true,

      message:
        "Entrada registrada correctamente",

      data:
        resultado

    });


  } catch (error) {

    console.error(
      "Error al registrar entrada:",
      error
    );


    return res.status(500).json({

      ok: false,

      message:
        error instanceof Error
          ? error.message
          : "Error al registrar entrada"

    });

  }

}
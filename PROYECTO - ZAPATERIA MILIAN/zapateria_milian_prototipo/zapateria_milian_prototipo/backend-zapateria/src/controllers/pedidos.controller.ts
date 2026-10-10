import {
  Request,
  Response
} from "express";
import { ErrorConfirmacionPedido } from "../services/confirmacion-pedido.service.js";

import {
  crearPedidoSchema,
  editarPedidoSchema,
  actualizarEstadoPedidoSchema
} from "../schemas/pedidos.schema.js";

import {
  listarPedidos,
  buscarPedidoPorId,
  crearPedido,
  editarPedido,
  actualizarEstadoPedido
} from "../services/pedidos.service.js";


function obtenerIdPedido(
  valor: string
): bigint | null {

  try {

    const id = BigInt(valor);

    if (id <= 0n) {
      return null;
    }

    return id;

  } catch {

    return null;

  }

}


export async function obtenerPedidos(
  req: Request,
  res: Response
) {

  try {

    const pedidos =
      await listarPedidos();

    return res.json({
      ok: true,
      data: pedidos
    });

  } catch (error) {

    console.error(
      "Error al obtener pedidos:",
      error
    );

    return res.status(500).json({
      ok: false,
      message:
        "Error al obtener los pedidos"
    });

  }

}


export async function obtenerPedidoPorId(
  req: Request,
  res: Response
) {

  try {

    const id =
      obtenerIdPedido(
        req.params.id as string
      );


    if (!id) {

      return res.status(400).json({
        ok: false,
        message:
          "El ID del pedido no es válido"
      });

    }


    const pedido =
      await buscarPedidoPorId(id);


    if (!pedido) {

      return res.status(404).json({
        ok: false,
        message:
          "Pedido no encontrado"
      });

    }


    return res.json({
      ok: true,
      data: pedido
    });

  } catch (error) {

    console.error(
      "Error al obtener pedido:",
      error
    );

    return res.status(500).json({
      ok: false,
      message:
        "Error al obtener el pedido"
    });

  }

}


export async function registrarPedido(
  req: Request,
  res: Response
) {

  try {

    const validacion =
      crearPedidoSchema.safeParse(
        req.body
      );


    if (!validacion.success) {

      return res.status(400).json({

        ok: false,

        message:
          "Datos del pedido inválidos",

        errores:
          validacion.error.flatten()

      });

    }


    const pedido =
      await crearPedido(
        validacion.data
      );


    return res.status(201).json({

      ok: true,

      message:
        "Pedido registrado correctamente",

      data: pedido

    });

  } catch (error) {

    console.error(
      "Error al registrar pedido:",
      error
    );


    return res.status(500).json({

      ok: false,

      message:
        error instanceof Error
          ? error.message
          : "Error al registrar el pedido"

    });

  }

}


export async function actualizarPedido(
  req: Request,
  res: Response
) {

  try {

    const id =
      obtenerIdPedido(
        req.params.id as string
      );


    if (!id) {

      return res.status(400).json({
        ok: false,
        message:
          "El ID del pedido no es válido"
      });

    }


    const validacion =
      editarPedidoSchema.safeParse(
        req.body
      );


    if (!validacion.success) {

      return res.status(400).json({

        ok: false,

        message:
          "Datos del pedido inválidos",

        errores:
          validacion.error.flatten()

      });

    }


    const pedido =
      await editarPedido(
        id,
        validacion.data
      );


    return res.json({

      ok: true,

      message:
        "Pedido actualizado correctamente",

      data: pedido

    });

  } catch (error) {

    console.error(
      "Error al actualizar pedido:",
      error
    );


    return res.status(500).json({

      ok: false,

      message:
        error instanceof Error
          ? error.message
          : "Error al actualizar el pedido"

    });

  }

}


export async function cambiarEstadoPedido(
  req: Request,
  res: Response
) {

  try {

    const id =
      obtenerIdPedido(
        req.params.id as string
      );


    if (!id) {

      return res.status(400).json({
        ok: false,
        message:
          "El ID del pedido no es válido"
      });

    }


    const validacion =
      actualizarEstadoPedidoSchema.safeParse(
        req.body
      );


    if (!validacion.success) {

      return res.status(400).json({

        ok: false,

        message:
          "Estado inválido",

        errores:
          validacion.error.flatten()

      });

    }


    const pedido =
      await actualizarEstadoPedido(
        id,
        validacion.data.estado
      );


    return res.json({

      ok: true,

      message:
        "Estado del pedido actualizado correctamente",

      data: pedido

    });

  } catch (error) {
    if (error instanceof ErrorConfirmacionPedido) {
      return res.status(error.status).json({ ok: false, message: error.message });
    }

    console.error(
      "Error al actualizar estado del pedido:",
      error
    );


    return res.status(500).json({

      ok: false,

      message:
        error instanceof Error
          ? error.message
          : "Error al actualizar el estado"

    });

  }

}

import type { Request, Response } from "express";
import { listarClientes, crearCliente, buscarClientePorId, actualizarCliente, inactivarCliente} from "../services/clientes.service.js";
import { crearClienteSchema, actualizarClienteSchema} from "../schemas/clientes.schema.js";


export async function obtenerClientes(req: Request, res: Response) {
  try {
    const clientes = await listarClientes();

    return res.status(200).json({
      ok: true,
      data: clientes,
    });
  } catch (error) {
    console.error("Error al obtener clientes:", error);

    return res.status(500).json({
      ok: false,
      message: "Error al obtener los clientes",
    });
  }
}

export async function registrarCliente(req: Request, res: Response) {
  try {
    const validacion = crearClienteSchema.safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({
        ok: false,
        message: "Datos inválidos",
        errors: validacion.error.flatten(),
      });
    }

    const cliente = await crearCliente(validacion.data);

    return res.status(201).json({
      ok: true,
      message: "Cliente registrado correctamente",
      data: cliente,
    });
  } catch (error) {
    console.error("Error al registrar cliente:", error);

    return res.status(500).json({
      ok: false,
      message: "Error al registrar el cliente",
    });
  }
}

export async function obtenerClientePorId(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        message: "El ID del cliente no es válido",
      });
    }

    const cliente = await buscarClientePorId(id);

    if (!cliente) {
      return res.status(404).json({
        ok: false,
        message: "Cliente no encontrado",
      });
    }

    return res.status(200).json({
      ok: true,
      data: cliente,
    });

  } catch (error) {
    console.error("Error al obtener cliente:", error);

    return res.status(500).json({
      ok: false,
      message: "Error al obtener el cliente",
    });
  }
}

export async function modificarCliente(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        message: "El ID del cliente no es válido",
      });
    }

    const validacion = actualizarClienteSchema.safeParse(req.body);

    if (!validacion.success) {
      return res.status(400).json({
        ok: false,
        message: "Datos inválidos",
        errors: validacion.error.flatten(),
      });
    }

    const clienteExistente = await buscarClientePorId(id);

    if (!clienteExistente) {
      return res.status(404).json({
        ok: false,
        message: "Cliente no encontrado",
      });
    }

    const clienteActualizado = await actualizarCliente(
      id,
      validacion.data
    );

    return res.status(200).json({
      ok: true,
      message: "Cliente actualizado correctamente",
      data: clienteActualizado,
    });

  } catch (error) {
    console.error("Error al actualizar cliente:", error);

    return res.status(500).json({
      ok: false,
      message: "Error al actualizar el cliente",
    });
  }
}

export async function eliminarCliente(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        message: "El ID del cliente no es válido",
      });
    }

    const clienteExistente = await buscarClientePorId(id);

    if (!clienteExistente) {
      return res.status(404).json({
        ok: false,
        message: "Cliente no encontrado",
      });
    }

    if (clienteExistente.estado === "INACTIVO") {
      return res.status(400).json({
        ok: false,
        message: "El cliente ya se encuentra inactivo",
      });
    }

    const cliente = await inactivarCliente(id);

    return res.status(200).json({
      ok: true,
      message: "Cliente inactivado correctamente",
      data: cliente,
    });
  } catch (error) {
    console.error("Error al inactivar cliente:", error);

    return res.status(500).json({
      ok: false,
      message: "Error al inactivar el cliente",
    });
  }
}
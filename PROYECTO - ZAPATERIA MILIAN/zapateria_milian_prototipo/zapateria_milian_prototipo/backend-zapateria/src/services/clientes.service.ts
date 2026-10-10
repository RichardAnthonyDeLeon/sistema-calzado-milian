import { prisma } from "../lib/prisma.js";


export async function listarClientes() {

  return prisma.tbl_clientes.findMany({

    orderBy: {
      id_cliente: "desc",
    },

  });

}


export async function crearCliente(data: {

  nombre: string;
  telefono?: string | null;
  correo?: string | null;
  nit?: string | null;
  direccion?: string | null;
  observaciones?: string | null;

}) {

  return prisma.tbl_clientes.create({

    data: {

      nombre: data.nombre,

      telefono:
        data.telefono ?? null,

      correo:
        data.correo ?? null,

      nit:
        data.nit ?? null,

      direccion:
        data.direccion ?? null,

      observaciones:
        data.observaciones ?? null,

      estado: "ACTIVO",

      fecha_registro:
        new Date(),

    },

  });

}


export async function buscarClientePorId(
  id: number
) {

  return prisma.tbl_clientes.findUnique({

    where: {
      id_cliente: id,
    },

  });

}


export async function actualizarCliente(

  id: number,

  data: {

    nombre?: string;
    telefono?: string | null;
    correo?: string | null;
    nit?: string | null;
    direccion?: string | null;
    observaciones?: string | null;
    estado?: "ACTIVO" | "INACTIVO";

  }

) {

  return prisma.tbl_clientes.update({

    where: {
      id_cliente: id,
    },

    data,

  });

}


export async function inactivarCliente(
  id: number
) {

  return prisma.tbl_clientes.update({

    where: {
      id_cliente: id,
    },

    data: {
      estado: "INACTIVO",
    },

  });

}
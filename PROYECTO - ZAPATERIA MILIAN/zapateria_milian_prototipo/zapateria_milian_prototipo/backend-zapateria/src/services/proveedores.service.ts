import { prisma } from "../lib/prisma.js";


export async function listarProveedores() {

  return prisma.tbl_proveedores.findMany({
    orderBy: {
      id_proveedor: "desc",
    },
  });

}


export async function crearProveedor(data: {

  nombre: string;
  contacto?: string | null;
  telefono?: string | null;
  correo?: string | null;
  nit?: string | null;
  direccion?: string | null;
  observaciones?: string | null;

}) {

  return prisma.tbl_proveedores.create({

    data: {

      nombre: data.nombre,
      contacto: data.contacto ?? null,
      telefono: data.telefono ?? null,
      correo: data.correo ?? null,
      nit: data.nit ?? null,
      direccion: data.direccion ?? null,
      observaciones: data.observaciones ?? null,
      estado: "ACTIVO",
      fecha_registro: new Date(),

    },

  });

}


export async function buscarProveedorPorId(id: number) {

  return prisma.tbl_proveedores.findUnique({
    where: {
      id_proveedor: id,
    },
  });

}


export async function actualizarProveedor(

  id: number,

  data: {

    nombre?: string;
    contacto?: string | null;
    telefono?: string | null;
    correo?: string | null;
    nit?: string | null;
    direccion?: string | null;
    observaciones?: string | null;
    estado?: "ACTIVO" | "INACTIVO";

  }

) {

  return prisma.tbl_proveedores.update({

    where: {
      id_proveedor: id,
    },

    data,

  });

}
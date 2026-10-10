import { prisma } from "../lib/prisma.js";


export async function listarProductos() {

  return prisma.tbl_productos.findMany({

    include: {
      tbl_variantes_producto: true,
    },

    orderBy: {
      id_producto: "desc",
    },

  });

}


export async function crearProducto(data: {

  nombre: string;
  categoria: string;
  precioBase: number;
  descripcion?: string | null;
  imagen?: string | null;

}) {

  return prisma.tbl_productos.create({

    data: {

      nombre:
        data.nombre,

      categoria:
        data.categoria,

      precio_venta:
        data.precioBase,

      descripcion:
        data.descripcion ?? null,

      imagen_url:
        data.imagen ?? null,

      estado:
        "ACTIVO",

    },

  });

}


export async function buscarProductoPorId(
  id: number
) {

  return prisma.tbl_productos.findUnique({

    where: {
      id_producto: id,
    },

    include: {
      tbl_variantes_producto: true,
    },

  });

}


export async function actualizarProducto(

  id: number,

  data: {

    nombre?: string;
    categoria?: string;
    precioBase?: number;
    descripcion?: string | null;
    imagen?: string | null;
    estado?: "ACTIVO" | "INACTIVO";

  }

) {

  return prisma.tbl_productos.update({

    where: {
      id_producto: id,
    },

    data: {

      nombre:
        data.nombre,

      categoria:
        data.categoria,

      precio_venta:
        data.precioBase,

      descripcion:
        data.descripcion,

      imagen_url:
        data.imagen,

      estado:
        data.estado,

    },

  });

}


export async function crearVariante(

  idProducto: number,

  data: {

    talla: string;
    color: string;
    material: string;
    suela: string;
    precio: number;

  }

) {

  return prisma.tbl_variantes_producto.create({

    data: {

      id_producto:
        idProducto,

      talla:
        data.talla,

      color:
        data.color,

      material:
        data.material,

      suela:
        data.suela,

      precio:
        data.precio,

      existencia_actual:
        0,

      estado:
        "ACTIVO",

    },

  });

}
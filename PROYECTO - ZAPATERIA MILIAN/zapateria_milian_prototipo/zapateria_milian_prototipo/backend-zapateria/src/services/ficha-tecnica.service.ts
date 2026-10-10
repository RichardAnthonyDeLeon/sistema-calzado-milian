import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import type { DatosMaterialFicha } from "../schemas/ficha-tecnica.schema.js";

export class ErrorFichaTecnica extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

const incluirMaterial = {
  tbl_materiales: { include: { tbl_unidades_medida: true } },
};

async function validarProducto(tx: Prisma.TransactionClient, idProducto: number) {
  const producto = await tx.tbl_productos.findUnique({ where: { id_producto: idProducto } });
  if (!producto) throw new ErrorFichaTecnica("El producto no existe.", 404);
  if (producto.estado !== "ACTIVO") {
    throw new ErrorFichaTecnica("El producto debe estar activo.", 400);
  }
}

async function validarMaterial(tx: Prisma.TransactionClient, idMaterial: number) {
  const material = await tx.tbl_materiales.findUnique({ where: { id_material: idMaterial } });
  if (!material) throw new ErrorFichaTecnica("El material no existe.", 404);
  if (material.estado !== "ACTIVO") {
    throw new ErrorFichaTecnica("El material debe estar activo.", 400);
  }
}

export async function listarFichaTecnica(idProducto: number) {
  return prisma.$transaction(async (tx) => {
    await validarProducto(tx, idProducto);
    return tx.tbl_producto_material.findMany({
      where: { id_producto: idProducto, estado: "ACTIVO" },
      include: incluirMaterial,
      orderBy: { id_producto_material: "asc" },
    });
  });
}

export async function agregarMaterialFicha(
  idProducto: number, idMaterial: number, data: DatosMaterialFicha
) {
  return prisma.$transaction(async (tx) => {
    await validarProducto(tx, idProducto);
    await validarMaterial(tx, idMaterial);
    const where = { id_producto: idProducto, id_material: idMaterial };
    const existente = await tx.tbl_producto_material.findUnique({
      where: { id_producto_id_material: where },
    });
    if (existente?.estado === "ACTIVO") {
      throw new ErrorFichaTecnica("El material ya está asociado a este producto.", 409);
    }
    if (existente) {
      // Actualización condicional: una petición concurrente no sobrescribe una reactivación.
      const resultado = await tx.tbl_producto_material.updateMany({
        where: { ...where, estado: "INACTIVO" },
        data: { ...data, estado: "ACTIVO" },
      });
      if (!resultado.count) {
        throw new ErrorFichaTecnica("El material ya está asociado a este producto.", 409);
      }
      return tx.tbl_producto_material.findUniqueOrThrow({
        where: { id_producto_id_material: where }, include: incluirMaterial,
      });
    }
    return tx.tbl_producto_material.create({
      data: { ...where, ...data, estado: "ACTIVO" }, include: incluirMaterial,
    });
  });
}

export async function actualizarMaterialFicha(
  idProducto: number, idMaterial: number, data: DatosMaterialFicha
) {
  return prisma.$transaction(async (tx) => {
    await validarProducto(tx, idProducto);
    await validarMaterial(tx, idMaterial);
    const where = { id_producto: idProducto, id_material: idMaterial };
    const resultado = await tx.tbl_producto_material.updateMany({
      where: { ...where, estado: "ACTIVO" }, data,
    });
    if (!resultado.count) throw new ErrorFichaTecnica("La asociación activa no existe.", 404);
    return tx.tbl_producto_material.findUniqueOrThrow({
      where: { id_producto_id_material: where }, include: incluirMaterial,
    });
  });
}

export async function quitarMaterialFicha(idProducto: number, idMaterial: number) {
  return prisma.$transaction(async (tx) => {
    await validarProducto(tx, idProducto);
    await validarMaterial(tx, idMaterial);
    const resultado = await tx.tbl_producto_material.updateMany({
      where: { id_producto: idProducto, id_material: idMaterial, estado: "ACTIVO" },
      data: { estado: "INACTIVO" },
    });
    if (!resultado.count) throw new ErrorFichaTecnica("La asociación activa no existe.", 404);
  });
}

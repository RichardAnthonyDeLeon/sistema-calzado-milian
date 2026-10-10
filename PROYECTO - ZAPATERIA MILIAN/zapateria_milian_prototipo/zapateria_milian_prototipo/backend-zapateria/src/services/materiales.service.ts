import { prisma } from "../lib/prisma.js";


function normalizarUnidad(unidad: string) {

  const unidades: Record<string, string> = {
    "m²": "m2",
    "unidad": "u",
    "par": "par",
    "L": "L",
    "m": "m",
    "kg": "kg"
  };

  return unidades[unidad] || unidad;

}


export async function listarMateriales() {

  return prisma.tbl_materiales.findMany({

    include: {
      tbl_unidades_medida: true,
    },

    orderBy: {
      id_material: "desc",
    },

  });

}


export async function crearMaterial(data: {

  nombre: string;
  unidad: string;
  existencia: number;
  minimo: number;
  costo: number;
  descripcion?: string | null;

}) {

  const abreviatura =
    normalizarUnidad(data.unidad);


  const unidad =
    await prisma.tbl_unidades_medida.findFirst({

      where: {
        abreviatura,
      },

    });


  if (!unidad) {
    throw new Error(
      "Unidad de medida no encontrada"
    );
  }


  return prisma.tbl_materiales.create({

    data: {

      id_unidad:
        unidad.id_unidad,

      nombre:
        data.nombre,

      descripcion:
        data.descripcion ?? null,

      existencia_actual:
        data.existencia,

      existencia_minima:
        data.minimo,

      costo_referencia:
        data.costo,

      estado:
        "ACTIVO",

    },

  });

}


export async function buscarMaterialPorId(
  id: number
) {

  return prisma.tbl_materiales.findUnique({

    where: {
      id_material: id,
    },

  });

}


export async function actualizarMaterial(

  id: number,

  data: {

    nombre?: string;
    unidad?: string;
    existencia?: number;
    minimo?: number;
    costo?: number;
    descripcion?: string | null;
    estado?: "ACTIVO" | "INACTIVO";

  }

) {

  let idUnidad:
    number | undefined;


  if (data.unidad) {

    const abreviatura =
      normalizarUnidad(data.unidad);


    const unidad =
      await prisma.tbl_unidades_medida.findFirst({

        where: {
          abreviatura,
        },

      });


    if (!unidad) {
      throw new Error(
        "Unidad de medida no encontrada"
      );
    }


    idUnidad =
      unidad.id_unidad;

  }


  return prisma.tbl_materiales.update({

    where: {
      id_material: id,
    },

    data: {

      nombre:
        data.nombre,

      descripcion:
        data.descripcion,

      existencia_actual:
        data.existencia,

      existencia_minima:
        data.minimo,

      costo_referencia:
        data.costo,

      estado:
        data.estado,

      id_unidad:
        idUnidad,

    },

  });

}

export async function registrarEntradaMaterial(data: {

  id_material: number;
  id_proveedor: number;
  cantidad: number;
  costo_total: number;
  observaciones?: string | null;

}) {

  // Temporalmente usamos el usuario 1
  // hasta implementar inicio de sesión.
  const idUsuario = 1;


  return prisma.$transaction(
    async (tx) => {

      const material =
        await tx.tbl_materiales.findUnique({

          where: {
            id_material:
              data.id_material
          }

        });


      if (!material) {
        throw new Error(
          "Material no encontrado"
        );
      }


      if (
        material.estado !== "ACTIVO"
      ) {
        throw new Error(
          "El material está inactivo"
        );
      }


      const proveedor =
        await tx.tbl_proveedores.findUnique({

          where: {
            id_proveedor:
              data.id_proveedor
          }

        });


      if (!proveedor) {
        throw new Error(
          "Proveedor no encontrado"
        );
      }


      const precioUnitario =
        data.costo_total > 0
          ? data.costo_total /
            data.cantidad
          : Number(
              material.costo_referencia
            );


      // 1. Crear compra
      const compra =
        await tx.tbl_compras.create({

          data: {

            id_proveedor:
              data.id_proveedor,

            id_usuario:
              idUsuario,

            total_compra:
              data.costo_total,

            observaciones:
              data.observaciones ?? null,

            estado:
              "RECIBIDA"

          }

        });


      // 2. Detalle de compra
await tx.tbl_detalle_compra.create({

  data: {

    id_compra:
      compra.id_compra,

    id_material:
      data.id_material,

    cantidad:
      data.cantidad,

    precio_unitario:
      precioUnitario,

    subtotal:
      data.cantidad * precioUnitario

  }

});

      // 3. Aumentar existencia
      const materialActualizado =
        await tx.tbl_materiales.update({

          where: {
            id_material:
              data.id_material
          },

          data: {

            existencia_actual: {
              increment:
                data.cantidad
            },

            costo_referencia:
              precioUnitario

          }

        });


      // 4. Registrar Kardex
      await tx.tbl_movimientos_material.create({

        data: {

          id_material:
            data.id_material,

          id_usuario:
            idUsuario,

          tipo_movimiento:
            "ENTRADA",

          cantidad:
            data.cantidad,

          tipo_referencia:
            "COMPRA",

          id_referencia:
            compra.id_compra,

          observaciones:
            data.observaciones ?? null

        }

      });


      return {

        id_compra:
          compra.id_compra.toString(),

        id_material:
          materialActualizado.id_material,

        existencia_actual:
          Number(
            materialActualizado
              .existencia_actual
          ),

        costo_referencia:
          Number(
            materialActualizado
              .costo_referencia
          )

      };

    }
  );

}
const API = 'http://localhost:3000/api/produccion'

export async function solicitarProduccion(ruta, datos) {
  const respuesta = await fetch(`${API}${ruta}`, datos === undefined ? undefined : {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos)
  })
  const resultado = await respuesta.json()
  if (!respuesta.ok || !resultado.ok) {
    const error = new Error(resultado.message || 'No se pudo completar la operación.')
    error.status = respuesta.status
    throw error
  }
  return resultado
}

export function adaptarPedido(pedido) {
  return {
    id: String(pedido.id_pedido), cliente: pedido.cliente,
    modelo: [...new Set(pedido.detalles.map(detalle => detalle.modelo))].join(' / '),
    fechaEstimada: pedido.fecha_estimada_entrega?.slice(0, 10) || 'Sin fecha estimada',
    tallas: pedido.detalles.map(detalle => ({ ...detalle, cantidad: Number(detalle.cantidad_pendiente) }))
  }
}

export function adaptarOrden(orden) {
  const tallas = orden.tallas.map(talla => ({ ...talla,
    id_produccion: String(talla.id_produccion), solicitada: Number(talla.solicitada), producida: Number(talla.producida)
  }))
  return { ...orden, tallas,
    modelo: [...new Set(tallas.map(talla => talla.modelo).filter(Boolean))].join(' / ') || orden.modelo,
    color: [...new Set(tallas.map(talla => talla.color))].join(' / '),
    lotes: orden.lotes.map(lote => {
      const talla = tallas.find(item => item.id_produccion === String(lote.id_produccion))
      return { ...lote, fecha: lote.fecha ? new Date(lote.fecha).toLocaleString('es-GT') : 'Sin fecha',
        tallas: [{ ...talla, talla: lote.talla, cantidad: Number(lote.cantidad) }] }
    })
  }
}

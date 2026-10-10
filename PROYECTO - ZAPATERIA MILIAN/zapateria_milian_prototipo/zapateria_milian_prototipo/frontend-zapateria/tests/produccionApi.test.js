import assert from 'node:assert/strict'
import { test } from 'node:test'
import { adaptarPedido, adaptarOrden, solicitarProduccion } from '../src/components/produccion/produccionApi.js'

test('conserva IDs grandes, modelos y cantidades del pedido real', () => {
  const pedido = adaptarPedido({ id_pedido: '9007199254740993', cliente: 'Cliente',
    fecha_estimada_entrega: '2026-10-10T00:00:00.000Z', detalles: [
      { id_detalle_pedido: '1', modelo: 'Modelo A', talla: '38', cantidad_pendiente: 2 },
      { id_detalle_pedido: '2', modelo: 'Modelo B', talla: '38', cantidad_pendiente: 3 }
    ] })
  assert.equal(pedido.id, '9007199254740993')
  assert.equal(pedido.fechaEstimada, '2026-10-10')
  assert.equal(pedido.modelo, 'Modelo A / Modelo B')
  assert.deepEqual(pedido.tallas.map(item => item.cantidad), [2, 3])
})

test('relaciona lotes por producción aunque las tallas coincidan', () => {
  const orden = adaptarOrden({ tallas: [
    { id_produccion: '10', id_variante: 100, modelo: 'A', color: 'Negro', talla: '38', solicitada: 3, producida: 1 },
    { id_produccion: '11', id_variante: 101, modelo: 'B', color: 'Café', talla: '38', solicitada: 4, producida: 2 }
  ], lotes: [{ id: 'LOT-1', id_produccion: '11', talla: '38', cantidad: 2, fecha: null }] })
  assert.equal(orden.lotes[0].tallas[0].id_variante, 101)
  assert.equal(orden.lotes[0].tallas[0].modelo, 'B')
  assert.equal(orden.modelo, 'A / B')
})

test('envía el contrato de lotes intacto y propaga errores del servidor', async t => {
  const datos = { numero_lote: 'L-001', fecha: '2026-10-09T16:00:00.000Z', observaciones: '',
    producciones: [{ id_produccion: '9007199254740993', cantidad: 2 }] }
  t.mock.method(globalThis, 'fetch', async (url, opciones) => {
    assert.equal(url, 'http://localhost:3000/api/produccion/lotes')
    assert.equal(opciones.method, 'POST')
    assert.deepEqual(JSON.parse(opciones.body), datos)
    return { ok: false, status: 409, json: async () => ({ ok: false, message: 'Existencia insuficiente' }) }
  })
  await assert.rejects(solicitarProduccion('/lotes', datos), error => error.status === 409 && error.message === 'Existencia insuficiente')
})

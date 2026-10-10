import { useRef, useState } from 'react'

function NuevaProduccionModal({ pedidos, crearProduccion, cerrarModal, cargando, guardando, errorCarga }) {
  const [pedidoId, setPedidoId] = useState('')
  const [error, setError] = useState('')
  const ocupado = useRef(false)
  const pedido = pedidos.find(item => item.id === pedidoId)
  async function guardar(evento) {
    evento.preventDefault()
    if (!pedido || cargando || errorCarga || ocupado.current) return
    ocupado.current = true
    setError('')
    try { await crearProduccion(pedido.id) } catch (fallo) { setError(fallo.message) }
    finally { ocupado.current = false }
  }
  return <div className="modal show">
    <div className="modal-backdrop" onClick={cerrarModal} />
    <div className="modal-card production-modal">
      <button className="modal-close" disabled={guardando} onClick={cerrarModal}>×</button>
      <p className="eyebrow">Producción</p><h3 className="modal-title">Nueva producción</h3>
      {(error || errorCarga) && <p className="note" role="alert">{error || errorCarga}</p>}
      {cargando && <p role="status">Consultando pedidos disponibles…</p>}
      <form onSubmit={guardar}>
        <div className="form-group"><label htmlFor="pedido-produccion">Pedido</label>
          <select id="pedido-produccion" value={pedidoId} onChange={evento => setPedidoId(evento.target.value)} disabled={guardando || cargando} required>
            <option value="">Seleccionar pedido</option>
            {pedidos.map(item => <option key={item.id} value={item.id}>PED-{item.id} - {item.cliente} - {item.modelo}</option>)}
          </select>
          {!cargando && !errorCarga && !pedidos.length && <small className="section-help">Actualmente no hay pedidos confirmados disponibles para iniciar producción.</small>}
        </div>
        {pedido && <>
          <div className="production-summary-grid">
            <div><small>Cliente</small><strong>{pedido.cliente}</strong></div>
            <div><small>Modelo</small><strong>{pedido.modelo}</strong></div>
            <div><small>Cantidad</small><strong>{pedido.tallas.reduce((total, talla) => total + talla.cantidad, 0)} pares</strong></div>
          </div>
          <p className="note">Fecha estimada de entrega: {pedido.fechaEstimada}</p>
          <div className="production-size-section"><p className="eyebrow">Pedido</p><h3>Distribución de tallas</h3>
            <div className="table-wrap"><table><thead><tr><th>Modelo / color</th><th>Talla</th><th>Cantidad</th></tr></thead>
              <tbody>{pedido.tallas.map(talla => <tr key={talla.id_detalle_pedido}><td>{talla.modelo} / {talla.color}</td><td>{talla.talla}</td><td>{talla.cantidad} pares</td></tr>)}</tbody>
            </table></div>
          </div>
          <div className="production-material-section"><p className="eyebrow">Materiales</p><h3>Material requerido</h3>
            <p className="note">La consulta anticipada de materiales está pendiente. Al registrar cada lote, el sistema validará la ficha técnica y las existencias reales y descontará los materiales correspondientes.</p>
          </div>
        </>}
        <div className="form-actions"><button type="button" className="btn btn-outline" disabled={guardando} onClick={cerrarModal}>Cancelar</button>
          <button type="submit" className="btn btn-gold" disabled={!pedido || guardando || cargando || !!errorCarga}>{guardando ? 'Registrando…' : 'Iniciar producción'}</button></div>
      </form>
    </div>
  </div>
}
export default NuevaProduccionModal

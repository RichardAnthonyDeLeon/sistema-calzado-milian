import { useRef, useState } from 'react'

function fechaLocal(fecha) {
  const valor = new Date(fecha)
  return new Date(valor.getTime() - valor.getTimezoneOffset() * 60000).toISOString().slice(0, 19)
}

function RegistrarLoteModal({ orden, guardar, cerrarModal }) {
  const clave = 'produccion-lote-pendiente-' + orden.id_pedido
  const [pendiente, setPendiente] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(clave)) } catch { return null }
  })
  const [numeroLote] = useState(() => pendiente?.numero_lote || 'L-' + crypto.randomUUID().replaceAll('-', '').slice(0, 28).toUpperCase())
  const [fecha, setFecha] = useState(() => fechaLocal(pendiente?.fecha || new Date()))
  const [observacion, setObservacion] = useState(pendiente?.observaciones || '')
  const [cantidades, setCantidades] = useState(() => Object.fromEntries(
    orden.tallas.map(talla => [talla.id_produccion, pendiente?.producciones.find(item => item.id_produccion === talla.id_produccion)?.cantidad ?? ''])
  ))
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const ocupado = useRef(false)
  const tallas = orden.tallas.filter(talla => talla.solicitada > talla.producida && !['CANCELADA', 'FINALIZADA'].includes(talla.estado))
  const total = Object.values(cantidades).reduce((suma, cantidad) => suma + (Number(cantidad) || 0), 0)

  async function enviar(evento) {
    evento.preventDefault()
    if (ocupado.current) return
    setError('')
    let datos = pendiente
    if (!datos) {
      if (!fecha || Number.isNaN(new Date(fecha).getTime())) { setError('Selecciona una fecha y hora válidas.'); return }
      const producciones = []
      for (const talla of tallas) {
        const cantidad = Number(cantidades[talla.id_produccion])
        if (!Number.isInteger(cantidad) || cantidad < 0 || cantidad > talla.solicitada - talla.producida) {
          setError('Las cantidades deben ser enteras y no superar los pares pendientes.'); return
        }
        if (cantidad > 0) producciones.push({ id_produccion: talla.id_produccion, cantidad })
      }
      if (!producciones.length || producciones.length > 100) { setError('Selecciona entre 1 y 100 producciones con cantidades positivas.'); return }
      datos = { numero_lote: numeroLote, fecha: new Date(fecha).toISOString(), observaciones: observacion.trim(), producciones }
    }
    ocupado.current = true
    setGuardando(true)
    // Conserva el mismo cuerpo y clave incluso si se pierde la respuesta o se recarga la página.
    setPendiente(datos)
    try { sessionStorage.setItem(clave, JSON.stringify(datos)) } catch { /* La protección permanece en memoria. */ }
    try {
      await guardar(datos)
      try { sessionStorage.removeItem(clave) } catch { /* Sin almacenamiento disponible. */ }
    } catch (fallo) {
      setError(fallo.message)
      if (fallo.status >= 400 && fallo.status < 500) {
        setPendiente(null)
        try { sessionStorage.removeItem(clave) } catch { /* Sin almacenamiento disponible. */ }
      }
    } finally {
      ocupado.current = false
      setGuardando(false)
    }
  }

  function cerrar() {
    if (!ocupado.current) cerrarModal()
  }
  const bloqueado = guardando || !!pendiente
  return <div className="modal show">
    <div className="modal-backdrop" onClick={cerrar} />
    <div className="modal-card production-modal">
      <button className="modal-close" disabled={guardando} onClick={cerrar}>×</button>
      <p className="eyebrow">Producción</p><h3 className="modal-title">Registrar lote</h3>
      {error && <p className="note" role="alert">{error}</p>}
      {pendiente && !guardando && <p className="note">Hay un envío pendiente de confirmar. Reintenta el mismo lote para consultar su resultado sin duplicar movimientos.</p>}
      <form onSubmit={enviar}>
        <div className="form-group"><label htmlFor="fecha-lote">Fecha y hora</label>
          <input id="fecha-lote" type="datetime-local" step="1" value={fecha} onChange={evento => setFecha(evento.target.value)} disabled={bloqueado} required />
        </div>
        <div className="production-size-section"><p className="eyebrow">Producción</p><h3>Pares producidos por talla</h3>
          <div className="table-wrap"><table><thead><tr><th>Talla</th><th>Pendientes</th><th>Producir</th></tr></thead>
            <tbody>{tallas.map(talla => <tr key={talla.id_produccion}>
              <td><strong>Talla {talla.talla}</strong><small style={{ display: 'block' }}>{talla.modelo} / {talla.color}</small></td>
              <td>{talla.solicitada - talla.producida} pares</td>
              <td><input className="venta-size-input" type="number" min="0" step="1" max={talla.solicitada - talla.producida}
                aria-label={'Cantidad para ' + talla.modelo + ', ' + talla.color + ', talla ' + talla.talla}
                value={cantidades[talla.id_produccion]} disabled={bloqueado}
                onChange={evento => setCantidades(actual => ({ ...actual, [talla.id_produccion]: evento.target.value }))} /></td>
            </tr>)}</tbody>
          </table></div>
          <div className="pedido-total-pares"><span>Total del lote</span><strong>{total} pares</strong></div>
        </div>
        <div className="form-group"><label htmlFor="observacion-lote">Observación</label>
          <textarea id="observacion-lote" value={observacion} onChange={evento => setObservacion(evento.target.value)} maxLength={500} disabled={bloqueado} placeholder="Ej. Primer lote terminado..." rows="3" />
        </div>
        <div className="form-actions"><button type="button" className="btn btn-outline" disabled={guardando} onClick={cerrar}>Cancelar</button>
          <button type="submit" className="btn btn-gold" disabled={guardando || (!pendiente && !tallas.length)}>{guardando ? 'Registrando…' : pendiente ? 'Reintentar mismo lote' : 'Registrar lote'}</button></div>
      </form>
    </div>
  </div>
}
export default RegistrarLoteModal

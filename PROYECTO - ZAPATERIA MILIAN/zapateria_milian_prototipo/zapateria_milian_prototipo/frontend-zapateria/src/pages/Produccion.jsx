import { useCallback, useEffect, useRef, useState } from 'react'
import ResumenProduccion from '../components/produccion/ResumenProduccion'
import TablaOrdenes from '../components/produccion/TablaOrdenes'
import NuevaProduccionModal from '../components/produccion/NuevaProduccionModal'
import DetalleProduccion from '../components/produccion/DetalleProduccion'
import RegistrarLoteModal from '../components/produccion/RegistrarLoteModal'
import { solicitarProduccion, adaptarPedido, adaptarOrden } from '../components/produccion/produccionApi'

function Produccion() {
  const [ordenes, setOrdenes] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [mostrarNueva, setMostrarNueva] = useState(false)
  const [detalleId, setDetalleId] = useState(null)
  const [loteId, setLoteId] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const ocupado = useRef(false)
  const version = useRef(0)

  const cargar = useCallback(async () => {
    const actual = ++version.current
    setCargando(true)
    setError('')
    try {
      const [lista, disponibles] = await Promise.all([
        solicitarProduccion(''), solicitarProduccion('/pedidos-disponibles')
      ])
      if (actual !== version.current) return
      setOrdenes(lista.data.map(adaptarOrden))
      setPedidos(disponibles.data.map(adaptarPedido))
    } catch (fallo) {
      if (actual === version.current) setError('No se pudieron actualizar los datos: ' + fallo.message)
    } finally {
      if (actual === version.current) setCargando(false)
    }
  }, [])

  useEffect(() => {
    void cargar()
    return () => { version.current++ }
  }, [cargar])

  async function crear(idPedido) {
    if (ocupado.current) return
    ocupado.current = true
    setGuardando(true)
    setMensaje('')
    try {
      const resultado = await solicitarProduccion('', { id_pedido: idPedido })
      setMostrarNueva(false)
      setMensaje(resultado.message)
      await cargar()
    } finally {
      ocupado.current = false
      setGuardando(false)
    }
  }

  async function registrar(datos) {
    if (ocupado.current) return
    ocupado.current = true
    setGuardando(true)
    setMensaje('')
    try {
      const resultado = await solicitarProduccion('/lotes', datos)
      setMensaje(resultado.message)
      setLoteId(null)
      await cargar()
    } finally {
      ocupado.current = false
      setGuardando(false)
    }
  }

  const detalle = ordenes.find(orden => orden.id === detalleId)
  const ordenLote = ordenes.find(orden => orden.id === loteId)
  const activas = ordenes.filter(orden => !['Completado', 'Cancelado'].includes(orden.estado))
  const pendientes = ordenes.filter(orden => orden.estado !== 'Cancelado').reduce((total, orden) =>
    total + orden.tallas.reduce((suma, talla) => suma + Math.max(talla.solicitada - talla.producida, 0), 0), 0)
  function claseEstado(estado) {
    return { Completado: 'status ready', 'En producción': 'status production', Cancelado: 'status cancelled' }[estado] || 'status pending'
  }

  return <section>
    <div className="page-actions">
      <div><p className="eyebrow">Producción</p><h3>Control de producción</h3></div>
      <button className="btn btn-gold" disabled={guardando || cargando} onClick={() => { setMostrarNueva(true); void cargar() }}>+ Nueva producción</button>
    </div>
    {cargando && <p className="note" role="status">Actualizando producción…</p>}
    {mensaje && <p className="note" role="status">{mensaje}</p>}
    {error && <div className="note" role="alert">{error} <button className="btn btn-outline" disabled={guardando || cargando} onClick={cargar}>Reintentar consulta</button></div>}
    <ResumenProduccion ordenesActivas={activas.length} paresPendientes={pendientes} ordenesCompletadas={ordenes.filter(orden => orden.estado === 'Completado').length} />
    <TablaOrdenes ordenes={ordenes} claseEstado={claseEstado} abrirDetalle={orden => setDetalleId(orden.id)} />
    {mostrarNueva && <NuevaProduccionModal pedidos={pedidos} cargando={cargando} errorCarga={error} guardando={guardando}
      crearProduccion={crear} cerrarModal={() => { if (!ocupado.current) setMostrarNueva(false) }} />}
    {detalle && !ordenLote && <DetalleProduccion orden={detalle} lotes={detalle.lotes} claseEstado={claseEstado}
      abrirLote={orden => setLoteId(orden.id)} cerrarModal={() => setDetalleId(null)} />}
    {ordenLote && <RegistrarLoteModal key={ordenLote.id} orden={ordenLote} guardar={registrar}
      cerrarModal={() => { if (!ocupado.current) setLoteId(null) }} />}
  </section>
}

export default Produccion

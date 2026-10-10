import { useEffect, useRef, useState } from 'react'

const API = 'http://localhost:3000/api'
const formularioVacio = { id_material: '', cantidad_por_par: '', porcentaje_desperdicio: '0' }

async function solicitar(url, opciones = {}) {
  const respuesta = await fetch(url, opciones)
  const resultado = await respuesta.json()
  if (!respuesta.ok || !resultado.ok) {
    const detalles = Object.values(resultado.errors?.fieldErrors || {}).flat().join(' ')
    throw new Error(detalles || resultado.message || 'No se pudo completar la operación.')
  }
  return resultado
}

function FichaTecnicaModal({ producto, cerrarModal }) {
  const [asociaciones, setAsociaciones] = useState([])
  const [materiales, setMateriales] = useState([])
  const [formulario, setFormulario] = useState(formularioVacio)
  const [editando, setEditando] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [cargaCompleta, setCargaCompleta] = useState(false)
  const [intento, setIntento] = useState(0)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const operacionEnCurso = useRef(false)
  const url = `${API}/productos/${producto.id}/materiales`

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      solicitar(url, { signal: controller.signal }),
      solicitar(`${API}/materiales`, { signal: controller.signal })
    ]).then(([ficha, catalogo]) => {
      if (controller.signal.aborted) return
      setAsociaciones(ficha.data)
      setMateriales(catalogo.data.filter(material => material.estado === 'ACTIVO'))
      setCargaCompleta(true)
    }).catch(errorCarga => {
      if (!controller.signal.aborted) setError(errorCarga.message)
    }).finally(() => {
      if (!controller.signal.aborted) setCargando(false)
    })
    return () => controller.abort()
  }, [url, intento])

  const disponibles = materiales.filter(material =>
    material.id_material === editando ||
    !asociaciones.some(asociacion => asociacion.id_material === material.id_material)
  )
  const materialSeleccionado = materiales.find(material =>
    material.id_material === Number(formulario.id_material)
  )

  function cambiar(evento) {
    setFormulario(actual => ({ ...actual, [evento.target.name]: evento.target.value }))
  }

  function cancelarEdicion() {
    setEditando(null)
    setFormulario(formularioVacio)
  }

  function reintentar() {
    setCargando(true)
    setCargaCompleta(false)
    setError('')
    setIntento(actual => actual + 1)
  }

  function editar(asociacion) {
    setError('')
    setMensaje('')
    setEditando(asociacion.id_material)
    setFormulario({
      id_material: String(asociacion.id_material),
      cantidad_por_par: String(asociacion.cantidad_por_par),
      porcentaje_desperdicio: String(asociacion.porcentaje_desperdicio)
    })
  }

  async function guardar(evento) {
    evento.preventDefault()
    if (operacionEnCurso.current || !cargaCompleta) return
    setError('')
    setMensaje('')
    const cantidad = Number(formulario.cantidad_por_par)
    const desperdicio = Number(formulario.porcentaje_desperdicio)
    if (!materialSeleccionado || !formulario.cantidad_por_par.trim() ||
      !formulario.porcentaje_desperdicio.trim() || !Number.isFinite(cantidad) ||
      cantidad <= 0 || cantidad > 9999999999.9999 || !Number.isFinite(desperdicio) ||
      desperdicio < 0 || desperdicio > 100) {
      setError('Selecciona un material activo, una cantidad positiva y un desperdicio entre 0 y 100 %.')
      return
    }
    operacionEnCurso.current = true
    setGuardando(true)
    try {
      const datos = { cantidad_por_par: cantidad, porcentaje_desperdicio: desperdicio }
      if (!editando) datos.id_material = Number(formulario.id_material)
      const resultado = await solicitar(editando ? `${url}/${editando}` : url, {
        method: editando ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      })
      setAsociaciones(actual => editando
        ? actual.map(asociacion => asociacion.id_material === editando ? resultado.data : asociacion)
        : [...actual, resultado.data])
      cancelarEdicion()
      setMensaje(resultado.message)
    } catch (errorGuardar) {
      setError(errorGuardar.message)
    } finally {
      operacionEnCurso.current = false
      setGuardando(false)
    }
  }

  async function quitar(asociacion) {
    if (operacionEnCurso.current || !window.confirm(
      `¿Quitar ${asociacion.tbl_materiales.nombre} de la ficha técnica de ${producto.nombre}?`
    )) return
    operacionEnCurso.current = true
    setGuardando(true)
    setError('')
    setMensaje('')
    try {
      const resultado = await solicitar(`${url}/${asociacion.id_material}`, { method: 'DELETE' })
      setAsociaciones(actual => actual.filter(item => item.id_material !== asociacion.id_material))
      if (editando === asociacion.id_material) cancelarEdicion()
      setMensaje(resultado.message)
    } catch (errorQuitar) {
      setError(errorQuitar.message)
    } finally {
      operacionEnCurso.current = false
      setGuardando(false)
    }
  }

  function cerrar() {
    if (!operacionEnCurso.current) cerrarModal()
  }

  return (
    <div className="modal show">
      <div className="modal-backdrop" onClick={cerrar} />
      <div className="modal-card production-modal" role="dialog" aria-modal="true" aria-labelledby="titulo-ficha">
        <button type="button" className="modal-close" onClick={cerrar} disabled={guardando} aria-label="Cerrar">×</button>
        <p className="eyebrow">Productos</p>
        <h3 className="modal-title" id="titulo-ficha">Ficha técnica de {producto.nombre}</h3>
        <p className="note">Materiales necesarios por par para este modelo de calzado.</p>

        {error && <p className="note" role="alert">{error}</p>}
        {mensaje && <p className="note" role="status">{mensaje}</p>}
        {cargando && <p role="status">Cargando ficha técnica…</p>}
        {!cargando && !cargaCompleta && (
          <button className="btn btn-outline" onClick={reintentar}>Reintentar</button>
        )}

        {cargaCompleta && <>
          <form onSubmit={guardar}>
            <h4>{editando ? 'Editar material asociado' : 'Agregar material'}</h4>
            <div className="form-grid">
              <div className="form-group full-row">
                <label htmlFor="ficha-material">Material</label>
                <select id="ficha-material" name="id_material" value={formulario.id_material} onChange={cambiar} disabled={guardando || !!editando} required>
                  <option value="">Selecciona un material</option>
                  {disponibles.map(material => <option key={material.id_material} value={material.id_material}>
                    {material.nombre} ({material.tbl_unidades_medida.abreviatura})
                  </option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="ficha-cantidad">Cantidad por par {materialSeleccionado && `(${materialSeleccionado.tbl_unidades_medida.abreviatura})`}</label>
                <input id="ficha-cantidad" name="cantidad_por_par" type="number" min="0.0001" max="9999999999.9999" step="0.0001" value={formulario.cantidad_por_par} onChange={cambiar} disabled={guardando} required />
              </div>
              <div className="form-group">
                <label htmlFor="ficha-desperdicio">Desperdicio (%)</label>
                <input id="ficha-desperdicio" name="porcentaje_desperdicio" type="number" min="0" max="100" step="0.01" value={formulario.porcentaje_desperdicio} onChange={cambiar} disabled={guardando} required />
              </div>
            </div>
            {!disponibles.length && <p className="note">No hay materiales activos disponibles para agregar.</p>}
            <div className="form-actions">
              {editando && <button type="button" className="btn btn-outline" onClick={cancelarEdicion} disabled={guardando}>Cancelar edición</button>}
              <button type="submit" className="btn btn-gold" disabled={guardando || !disponibles.length}>
                {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Agregar material'}
              </button>
            </div>
          </form>

          <div className="table-wrap product-variants-table">
            <table>
              <thead><tr><th>Material</th><th>Unidad</th><th>Cantidad por par</th><th>Desperdicio</th><th>Acciones</th></tr></thead>
              <tbody>
                {asociaciones.map(asociacion => <tr key={asociacion.id_producto_material}>
                  <td>{asociacion.tbl_materiales.nombre}{asociacion.tbl_materiales.estado !== 'ACTIVO' && ' (inactivo)'}</td>
                  <td>{asociacion.tbl_materiales.tbl_unidades_medida.abreviatura}</td>
                  <td>{Number(asociacion.cantidad_por_par)}</td>
                  <td>{Number(asociacion.porcentaje_desperdicio)} %</td>
                  <td>
                    <button type="button" className="btn btn-outline" onClick={() => editar(asociacion)} disabled={guardando || asociacion.tbl_materiales.estado !== 'ACTIVO'}>Editar</button>{' '}
                    <button type="button" className="text-btn" onClick={() => quitar(asociacion)} disabled={guardando}>Quitar</button>
                  </td>
                </tr>)}
                {!asociaciones.length && <tr><td colSpan="5" className="empty-table">Este producto todavía no tiene materiales asociados.</td></tr>}
              </tbody>
            </table>
          </div>
        </>}
        <div className="form-actions"><button type="button" className="btn btn-outline" onClick={cerrar} disabled={guardando}>Cerrar</button></div>
      </div>
    </div>
  )
}

export default FichaTecnicaModal

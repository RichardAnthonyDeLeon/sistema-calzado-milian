function DetalleProduccion({
  orden,
  lotes,
  claseEstado,
  abrirLote,
  cerrarModal
}) {
  let envioPendiente = false
  try { envioPendiente = !!sessionStorage.getItem('produccion-lote-pendiente-' + orden.id_pedido) } catch { /* Sin almacenamiento disponible. */ }

  const cantidadTotal =
    orden.tallas.reduce(
      (total, talla) =>
        total +
        talla.solicitada,
      0
    )


  const producidoTotal =
    orden.tallas.reduce(
      (total, talla) =>
        total +
        talla.producida,
      0
    )


  const pendiente =
    cantidadTotal -
    producidoTotal


  const porcentaje =
    cantidadTotal > 0
      ? Math.round(
          (
            producidoTotal /
            cantidadTotal
          ) * 100
        )
      : 0


  return (
    <div className="modal show">

      <div
        className="modal-backdrop"
        onClick={cerrarModal}
      />


      <div className="modal-card production-modal">

        <button
          className="modal-close"
          onClick={cerrarModal}
        >
          ×
        </button>


        <div className="pedido-detail-header">

          <div>

            <p className="eyebrow">
              Producción
            </p>

            <h3 className="modal-title">
              {orden.id}
            </h3>

          </div>


          <span
            className={
              claseEstado(
                orden.estado
              )
            }
          >
            {orden.estado}
          </span>

        </div>


        <div className="production-summary-grid">

          <div>

            <small>
              Pedido
            </small>

            <strong>
              {orden.pedidoId}
            </strong>

          </div>


          <div>

            <small>
              Cliente
            </small>

            <strong>
              {orden.cliente}
            </strong>

          </div>


          <div>

            <small>
              Modelo
            </small>

            <strong>
              {orden.modelo}
            </strong>

          </div>

        </div>


        <div className="production-progress-section">

          <div className="production-progress-info">

            <span>
              Progreso
            </span>

            <strong>
              {producidoTotal} / {cantidadTotal} pares
            </strong>

          </div>


          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width:
                  `${porcentaje}%`
              }}
            />

          </div>


          <span className="progress-percent">
            {porcentaje}%
          </span>

        </div>


        <div className="production-size-section">

          <div className="section-header-inline">

            <div>

              <p className="eyebrow">
                Tallas
              </p>

              <h3>
                Estado de producción
              </h3>

            </div>


            {(envioPendiente || orden.tallas.some(talla => talla.solicitada > talla.producida && !['CANCELADA', 'FINALIZADA'].includes(talla.estado))) && (

              <button
                className="btn btn-gold"
                onClick={() =>
                  abrirLote(
                    orden
                  )
                }
              >
                {envioPendiente ? 'Confirmar lote pendiente' : '+ Registrar lote'}
              </button>

            )}

          </div>


          <div className="table-wrap">

            <table>

              <thead>
                <tr>
                  <th>Talla</th>
                  <th>Solicitados</th>
                  <th>Producidos</th>
                  <th>Pendientes</th>
                </tr>
              </thead>


              <tbody>

                {orden.tallas.map(
                  talla => {

                    const faltan =
                      talla.solicitada -
                      talla.producida


                    return (

                      <tr
                        key={
                          talla.id_produccion
                        }
                      >

                        <td>
                          <strong>
                            Talla {talla.talla}
                          </strong>
                          <small style={{ display: 'block' }}>{talla.modelo} / {talla.color}</small>
                        </td>

                        <td>
                          {talla.solicitada}
                        </td>

                        <td>
                          {talla.producida}
                        </td>

                        <td>
                          {faltan}
                        </td>

                      </tr>

                    )
                  }
                )}

              </tbody>

            </table>

          </div>


          <div className="pedido-total-pares">

            <span>
              Total pendiente
            </span>

            <strong>
              {pendiente} pares
            </strong>

          </div>

        </div>


        <div className="production-lotes">

          <p className="eyebrow">
            Historial
          </p>

          <h3>
            Lotes registrados
          </h3>


          <div className="table-wrap">

            <table>

              <thead>
                <tr>
                  <th>Lote</th>
                  <th>Fecha</th>
                  <th>Tallas</th>
                  <th>Cantidad</th>
                  <th>Observación</th>
                </tr>
              </thead>


              <tbody>

                {lotes.map(
                  lote => (

                    <tr key={lote.id}>

                      <td>
                        {lote.id}
                      </td>

                      <td>
                        {lote.fecha}
                      </td>

                      <td>

                        {lote.tallas.map(
                          talla =>
                            `${talla.modelo} / ${talla.color} / ${talla.talla}: ${talla.cantidad}`
                        ).join(' | ')}

                      </td>

                      <td>
                        {lote.cantidad} pares
                      </td>

                      <td>
                        {lote.observacion || '—'}
                      </td>

                    </tr>

                  )
                )}


                {lotes.length === 0 && (

                  <tr>

                    <td
                      colSpan="5"
                      className="empty-table"
                    >
                      Todavía no se han registrado lotes.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  )
}


export default DetalleProduccion

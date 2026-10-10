function TablaOrdenes({
  ordenes,
  claseEstado,
  abrirDetalle
}) {

  return (
    <div className="panel">

      <div className="panel-header">

        <div>

          <p className="eyebrow">
            Producción
          </p>

          <h3>
            Órdenes de producción
          </h3>

        </div>

      </div>


      <div className="table-wrap">

        <table>

          <thead>
            <tr>
              <th>Orden</th>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Modelo</th>
              <th>Cantidad</th>
              <th>Producido</th>
              <th>Progreso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>


          <tbody>
            {ordenes.length === 0 && <tr><td colSpan="9" className="empty-table">No hay órdenes de producción para mostrar.</td></tr>}

            {ordenes.map(
              orden => {

                const cantidad =
                  orden.tallas.reduce(
                    (total, talla) =>
                      total +
                      talla.solicitada,
                    0
                  )


                const producido =
                  orden.tallas.reduce(
                    (total, talla) =>
                      total +
                      talla.producida,
                    0
                  )


                const porcentaje =
                  cantidad > 0
                    ? Math.round(
                        (
                          producido /
                          cantidad
                        ) * 100
                      )
                    : 0


                return (

                  <tr key={orden.id}>

                    <td>
                      <strong>
                        {orden.id}
                      </strong>
                    </td>


                    <td>
                      {orden.pedidoId}
                    </td>


                    <td>
                      {orden.cliente}
                    </td>


                    <td>

                      <strong>
                        {orden.modelo}
                      </strong>

                      <small
                        style={{
                          display: 'block'
                        }}
                      >
                        {orden.color}
                      </small>

                    </td>


                    <td>
                      {cantidad} pares
                    </td>


                    <td>
                      {producido} pares
                    </td>


                    <td>

                      <div className="production-table-progress">

                        <div className="progress-bar">

                          <div
                            className="progress-fill"
                            style={{
                              width:
                                `${porcentaje}%`
                            }}
                          />

                        </div>

                        <small>
                          {porcentaje}%
                        </small>

                      </div>

                    </td>


                    <td>

                      <span
                        className={
                          claseEstado(
                            orden.estado
                          )
                        }
                      >
                        {orden.estado}
                      </span>

                    </td>


                    <td>

                      <div className="table-actions">

                        <button
                          className="btn btn-outline"
                          onClick={() =>
                            abrirDetalle(
                              orden
                            )
                          }
                        >
                          Detalle
                        </button>


                        {orden.estado ===
                          'Pendiente' && (

                          <button
                            className="text-btn"
                            disabled
                            title="Cancelación pendiente de implementar en el backend"
                          >
                            Cancelar (pendiente)
                          </button>

                        )}

                      </div>

                    </td>

                  </tr>

                )
              }
            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}


export default TablaOrdenes

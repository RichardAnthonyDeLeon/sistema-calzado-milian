function TablaCreditos({
  creditos,
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  claseEstado,
  abrirDetalle,
  abrirAbono
}) {

  return (
    <div className="panel">

      <div className="panel-header">

        <div>

          <p className="eyebrow">
            Créditos
          </p>

          <h3>
            Créditos registrados
          </h3>

        </div>

      </div>


      <div className="filters">

        <div className="search">

          ⌕

          <input
            type="text"
            placeholder="Buscar crédito..."
            value={busqueda}
            onChange={
              evento =>
                setBusqueda(
                  evento.target.value
                )
            }
          />

        </div>


        <select
          value={filtroEstado}
          onChange={
            evento =>
              setFiltroEstado(
                evento.target.value
              )
          }
        >

          <option value="Todos">
            Todos
          </option>

          <option value="Activo">
            Activos
          </option>

          <option value="Pagado">
            Pagados
          </option>

        </select>

      </div>


      <div className="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Crédito</th>
              <th>Cliente</th>
              <th>Origen</th>
              <th>Total</th>
              <th>Abonado</th>
              <th>Saldo</th>
              <th>Progreso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>

          </thead>


          <tbody>

            {creditos.map(
              credito => {

                const abonado =
                  credito.total -
                  credito.saldo


                const porcentaje =
                  credito.total > 0
                    ? Math.round(
                        (
                          abonado /
                          credito.total
                        ) * 100
                      )
                    : 0


                return (

                  <tr key={credito.id}>

                    <td>

                      <strong>
                        {credito.id}
                      </strong>

                      <small
                        style={{
                          display: 'block'
                        }}
                      >
                        {credito.fecha}
                      </small>

                    </td>


                    <td>
                      {credito.cliente}
                    </td>


                    <td>

                      <strong>
                        {credito.pedidoId}
                      </strong>

                      <small
                        style={{
                          display: 'block'
                        }}
                      >
                        {credito.ventaId}
                      </small>

                    </td>


                    <td>
                      Q {Number(
                        credito.total
                      ).toFixed(2)}
                    </td>


                    <td>
                      Q {Number(
                        abonado
                      ).toFixed(2)}
                    </td>


                    <td>
                      <strong>
                        Q {Number(
                          credito.saldo
                        ).toFixed(2)}
                      </strong>
                    </td>


                    <td>

                      <div className="credit-table-progress">

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
                            credito.estado
                          )
                        }
                      >
                        {credito.estado}
                      </span>

                    </td>


                    <td>

                      <div className="table-actions">

                        <button
                          className="btn btn-outline"
                          onClick={() =>
                            abrirDetalle(
                              credito
                            )
                          }
                        >
                          Detalle
                        </button>


                        {credito.estado ===
                          'Activo' && (

                          <button
                            className="text-btn"
                            onClick={() =>
                              abrirAbono(
                                credito
                              )
                            }
                          >
                            Registrar abono
                          </button>

                        )}

                      </div>

                    </td>

                  </tr>

                )
              }
            )}


            {creditos.length === 0 && (

              <tr>

                <td
                  colSpan="9"
                  className="empty-table"
                >
                  No se encontraron créditos.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}


export default TablaCreditos
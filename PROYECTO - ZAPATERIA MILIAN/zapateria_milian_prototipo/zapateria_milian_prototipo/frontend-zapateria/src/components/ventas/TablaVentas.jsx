function TablaVentas({
  ventas,
  busqueda,
  setBusqueda,
  filtroPago,
  setFiltroPago,
  claseEstado,
  anularVenta
}) {
  return (
    <div className="panel">

      <div className="panel-header">

        <div>

          <p className="eyebrow">
            Ventas
          </p>

          <h3>
            Ventas registradas
          </h3>

        </div>

      </div>


      <div className="filters">

        <div className="search">

          ⌕

          <input
            type="text"
            placeholder="Buscar venta..."
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
          value={filtroPago}
          onChange={
            evento =>
              setFiltroPago(
                evento.target.value
              )
          }
        >

          <option value="Todos">
            Todos
          </option>

          <option value="Contado">
            Contado
          </option>

          <option value="Crédito">
            Crédito
          </option>

        </select>

      </div>


      <div className="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Venta</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Referencia</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Pago</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>

          </thead>


          <tbody>

            {ventas.map(venta => (

              <tr key={venta.id}>

                <td>
                  <strong>
                    {venta.id}
                  </strong>
                </td>


                <td>
                  {venta.fecha}
                </td>


                <td>
                  {venta.cliente}
                </td>


                <td>
                  {venta.referencia || '—'}
                </td>


                <td>

                  <strong>
                    {venta.producto}
                  </strong>

                  <small
                    style={{
                      display: 'block',
                      marginTop: '3px'
                    }}
                  >
                    Q {Number(
                      venta.precioUnitario
                    ).toFixed(2)} c/u
                  </small>

                </td>


                <td>
                  {venta.cantidad}
                </td>


                <td>
                  Q {Number(
                    venta.total
                  ).toFixed(2)}
                </td>


                <td>
                  {venta.tipoPago}
                </td>


                <td>

                  <span
                    className={
                      claseEstado(
                        venta.estado
                      )
                    }
                  >
                    {venta.estado}
                  </span>

                </td>


                <td>

                  {venta.estado !== 'Anulada' ? (

                    <button
                      className="text-btn"
                      onClick={() =>
                        anularVenta(
                          venta
                        )
                      }
                    >
                      Anular
                    </button>

                  ) : (

                    <span
                      style={{
                        color: 'var(--muted)',
                        fontSize: '12px'
                      }}
                    >
                      —
                    </span>

                  )}

                </td>

              </tr>

            ))}


            {ventas.length === 0 && (

              <tr>

                <td
                  colSpan="10"
                  className="empty-table"
                >
                  No se encontraron ventas.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}


export default TablaVentas
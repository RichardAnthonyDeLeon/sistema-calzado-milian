function InventarioTerminados({
  inventario,
  busqueda,
  setBusqueda
}) {

  // ========================================
  // FILTRAR INVENTARIO
  // ========================================

  const inventarioFiltrado =
    inventario.filter(item => {

      const texto =
        busqueda
          .toLowerCase()
          .trim()


      return (

        item.modelo
          .toLowerCase()
          .includes(texto) ||

        item.color
          .toLowerCase()
          .includes(texto) ||

        String(item.talla)
          .toLowerCase()
          .includes(texto) ||

        item.origen
          .toLowerCase()
          .includes(texto) ||

        String(item.pedidoId || '')
          .toLowerCase()
          .includes(texto) ||

        String(item.destino || '')
          .toLowerCase()
          .includes(texto)

      )
    })


  // ========================================
  // TOTAL DE PARES MOSTRADOS
  // ========================================

  const totalPares =
    inventarioFiltrado.reduce(
      (total, item) =>
        total +
        Number(item.existencia),
      0
    )


  return (

    <div className="panel">

      {/* ============================= */}
      {/* ENCABEZADO */}
      {/* ============================= */}

      <div className="panel-header">

        <div>

          <p className="eyebrow">
            Inventario
          </p>

          <h3>
            Productos terminados
          </h3>

        </div>


        <div className="finished-total">

          <small>
            Existencia mostrada
          </small>

          <strong>
            {totalPares} pares
          </strong>

        </div>

      </div>


      {/* ============================= */}
      {/* BUSCADOR */}
      {/* ============================= */}

      <div className="filters">

        <div className="search">

          ⌕

          <input
            type="text"
            placeholder="Buscar modelo, talla, color, pedido..."
            value={busqueda}
            onChange={
              evento =>
                setBusqueda(
                  evento.target.value
                )
            }
          />

        </div>

      </div>


      {/* ============================= */}
      {/* TABLA */}
      {/* ============================= */}

      <div className="table-wrap">

        <table>

          <thead>

            <tr>

              <th>
                Modelo
              </th>

              <th>
                Talla
              </th>

              <th>
                Color
              </th>

              <th>
                Existencia
              </th>

              <th>
                Origen
              </th>

              <th>
                Destino
              </th>

              <th>
                Estado
              </th>

            </tr>

          </thead>


          <tbody>

            {inventarioFiltrado.map(
              item => {

                const existencia =
                  Number(
                    item.existencia
                  )


                const tieneExistencia =
                  existencia > 0


                const reservadoPedido =
                  item.destino ===
                  'Pedido'


                return (

                  <tr key={item.id}>

                    {/* MODELO */}

                    <td>

                      <strong>
                        {item.modelo}
                      </strong>

                    </td>


                    {/* TALLA */}

                    <td>
                      Talla {item.talla}
                    </td>


                    {/* COLOR */}

                    <td>
                      {item.color}
                    </td>


                    {/* EXISTENCIA */}

                    <td>

                      <strong>
                        {existencia}
                      </strong>

                      {' pares'}

                    </td>


                    {/* ORIGEN */}

                    <td>

                      <strong>
                        {item.origen}
                      </strong>

                      <small
                        style={{
                          display:
                            'block'
                        }}
                      >
                        {item.tipoOrigen}
                      </small>

                    </td>


                    {/* DESTINO */}

                    <td>

                      {reservadoPedido ? (

                        <div>

                          <strong>
                            Pedido
                          </strong>

                          <small
                            style={{
                              display:
                                'block'
                            }}
                          >
                            {item.pedidoId}
                          </small>

                        </div>

                      ) : (

                        <div>

                          <strong>
                            Venta directa
                          </strong>

                          <small
                            style={{
                              display:
                                'block'
                            }}
                          >
                            Stock disponible
                          </small>

                        </div>

                      )}

                    </td>


                    {/* ESTADO */}

                    <td>

                      {!tieneExistencia ? (

                        <span className="status cancelled">
                          Sin existencia
                        </span>

                      ) : reservadoPedido ? (

                        <span className="status production">
                          Reservado
                        </span>

                      ) : (

                        <span className="status ready">
                          Disponible
                        </span>

                      )}

                    </td>

                  </tr>

                )
              }
            )}


            {/* SIN RESULTADOS */}

            {inventarioFiltrado.length ===
              0 && (

              <tr>

                <td
                  colSpan="7"
                  className="empty-table"
                >
                  No se encontraron productos terminados.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  )
}


export default InventarioTerminados
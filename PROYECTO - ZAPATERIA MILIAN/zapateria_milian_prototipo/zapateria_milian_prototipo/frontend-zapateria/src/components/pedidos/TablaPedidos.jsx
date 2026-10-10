function TablaPedidos({
  pedidos,
  confirmarPedido,
  confirmando,
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  claseEstado,
  abrirDetalle,
  abrirEditar,
  cancelarPedido
}) {

  function obtenerCantidad(pedido) {
    return pedido.tallas.reduce(
      (total, item) =>
        total + Number(item.cantidad),
      0
    )
  }

  return (
    <div className="panel">

      <div className="panel-header">

        <div>
          <p className="eyebrow">
            Pedidos
          </p>

          <h3>
            Pedidos registrados
          </h3>
        </div>

      </div>

      <div className="filters">

        <div className="search">

          ⌕

          <input
            type="text"
            placeholder="Buscar pedido..."
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

          <option value="Borrador">Borrador</option>
          <option value="Confirmado">Confirmado</option>
          <option value="Entregado">Entregado</option>

          <option value="En producción">
            En producción
          </option>

          <option value="Listo">
            Listo
          </option>

          <option value="Cancelado">
            Cancelado
          </option>

        </select>

      </div>

      <div className="table-wrap">

        <table>

          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Modelo</th>
              <th>Cantidad</th>
              <th>Entrega</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {pedidos.map(
              pedido => (

                <tr key={pedido.id}>

                  <td>
                    <strong>
                      {pedido.id}
                    </strong>
                  </td>

                  <td>
                    {pedido.cliente}
                  </td>

                  <td>

                    <strong>
                      {pedido.modelo}
                    </strong>

                    <small
                      style={{
                        display: 'block',
                        marginTop: '3px'
                      }}
                    >
                      {pedido.color}
                    </small>

                  </td>

                  <td>
                    {obtenerCantidad(
                      pedido
                    )} pares
                  </td>

                  <td>
                    {pedido.fechaEntrega}
                  </td>

                  <td>
                    Q {Number(
                      pedido.total
                    ).toFixed(2)}
                  </td>

                  <td>

                    <span
                      className={
                        claseEstado(
                          pedido.estado
                        )
                      }
                    >
                      {pedido.estado}
                    </span>

                  </td>

                  <td>

                    <div className="client-actions">

                      <button
                        className="text-btn"
                        onClick={() =>
                          abrirDetalle(
                            pedido
                          )
                        }
                      >
                        Detalle
                      </button>

                      {pedido.estadoBD === 'BORRADOR' && (
                        <button className="text-btn" disabled={confirmando} onClick={() => confirmarPedido(pedido)}>
                          {confirmando ? 'Confirmando…' : 'Confirmar pedido'}
                        </button>
                      )}

                      {['BORRADOR', 'CONFIRMADO'].includes(pedido.estadoBD) && (
                        <>
                          <button
                            className="text-btn"
                            onClick={() =>
                              abrirEditar(
                                pedido
                              )
                            }
                          >
                            Editar
                          </button>

                          <button
                            className="text-btn"
                            onClick={() =>
                              cancelarPedido(
                                pedido
                              )
                            }
                          >
                            Cancelar
                          </button>
                        </>
                      )}

                    </div>

                  </td>

                </tr>

              )
            )}

            {pedidos.length === 0 && (
              <tr>

                <td
                  colSpan="8"
                  className="empty-table"
                >
                  No se encontraron pedidos.
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default TablaPedidos

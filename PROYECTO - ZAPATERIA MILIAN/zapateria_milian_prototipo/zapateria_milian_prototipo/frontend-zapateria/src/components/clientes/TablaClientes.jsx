function TablaClientes({
  clientes,
  busqueda,
  setBusqueda,
  abrirEditar,
  cambiarEstado
}) {
  return (
    <div className="panel">

      <div className="panel-header">

        <div>
          <p className="eyebrow">
            Clientes
          </p>

          <h3>
            Clientes registrados
          </h3>
        </div>

      </div>


      <div className="filters">

        <div className="search">
          ⌕

          <input
            type="text"
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={evento =>
              setBusqueda(evento.target.value)
            }
          />
        </div>

      </div>


      <div className="table-wrap">

        <table>

          <thead>
            <tr>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {clientes.map(cliente => (

              <tr key={cliente.id}>

                <td>
                  <strong>
                    {cliente.nombre}
                  </strong>
                </td>

                <td>
                  {cliente.telefono}
                </td>

                <td>
                  {cliente.correo || '—'}
                </td>

                <td>
                  {cliente.direccion || '—'}
                </td>

                <td>
                  <span
                    className={
                      cliente.activo
                        ? 'status ready'
                        : 'status cancelled'
                    }
                  >
                    {cliente.activo
                      ? 'Activo'
                      : 'Inactivo'}
                  </span>
                </td>

                <td>

                  <div className="client-actions">

                    <button
                      className="text-btn"
                      onClick={() =>
                        abrirEditar(cliente)
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="text-btn"
                      onClick={() =>
                        cambiarEstado(cliente)
                      }
                    >
                      {cliente.activo
                        ? 'Desactivar'
                        : 'Reactivar'}
                    </button>

                  </div>

                </td>

              </tr>

            ))}


            {clientes.length === 0 && (

              <tr>

                <td
                  colSpan="6"
                  className="empty-table"
                >
                  No se encontraron clientes.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default TablaClientes
function TablaProveedores({
  proveedores,
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
            Proveedores
          </p>

          <h3>
            Proveedores registrados
          </h3>
        </div>

      </div>


      <div className="filters">

        <div className="search">
          ⌕

          <input
            type="text"
            placeholder="Buscar proveedor..."
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
              <th>Proveedor</th>
              <th>Contacto</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {proveedores.map(proveedor => (

              <tr key={proveedor.id}>

                <td>
                  <strong>
                    {proveedor.nombre}
                  </strong>
                </td>

                <td>
                  {proveedor.contacto || '—'}
                </td>

                <td>
                  {proveedor.telefono}
                </td>

                <td>
                  {proveedor.correo || '—'}
                </td>

                <td>
                  {proveedor.direccion || '—'}
                </td>

                <td>
                  <span
                    className={
                      proveedor.activo
                        ? 'status ready'
                        : 'status cancelled'
                    }
                  >
                    {proveedor.activo
                      ? 'Activo'
                      : 'Inactivo'}
                  </span>
                </td>

                <td>

                  <div className="client-actions">

                    <button
                      className="text-btn"
                      onClick={() =>
                        abrirEditar(proveedor)
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="text-btn"
                      onClick={() =>
                        cambiarEstado(proveedor)
                      }
                    >
                      {proveedor.activo
                        ? 'Desactivar'
                        : 'Reactivar'}
                    </button>

                  </div>

                </td>

              </tr>

            ))}


            {proveedores.length === 0 && (

              <tr>

                <td
                  colSpan="7"
                  className="empty-table"
                >
                  No se encontraron proveedores.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default TablaProveedores
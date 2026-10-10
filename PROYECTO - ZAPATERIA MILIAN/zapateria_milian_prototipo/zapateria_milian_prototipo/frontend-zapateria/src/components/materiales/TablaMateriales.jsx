function TablaMateriales({
  materiales,
  busqueda,
  setBusqueda,
  abrirEditar,
  cambiarEstado,
  obtenerEstado
}) {
  return (
    <div className="panel">

      <div className="panel-header">

        <div>
          <p className="eyebrow">
            Materiales
          </p>

          <h3>
            Inventario de materiales
          </h3>
        </div>

      </div>


      <div className="filters">

        <div className="search">
          ⌕

          <input
            type="text"
            placeholder="Buscar material..."
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
              <th>Material</th>
              <th>Unidad</th>
              <th>Existencia</th>
              <th>Stock mínimo</th>
              <th>Costo</th>
              <th>Estado stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {materiales.map(material => {

              const estadoStock =
                obtenerEstado(material)

              return (
                <tr key={material.id}>

                  <td>
                    <strong>
                      {material.nombre}
                    </strong>
                  </td>

                  <td>
                    {material.unidad}
                  </td>

                  <td>
                    {material.existencia}
                  </td>

                  <td>
                    {material.minimo}
                  </td>

                  <td>
                    Q {Number(material.costo).toFixed(2)}
                  </td>

                  <td>
                    <span
                      className={
                        estadoStock === 'Bajo'
                          ? 'status cancelled'
                          : estadoStock === 'Atención'
                            ? 'status pending'
                            : 'status ready'
                      }
                    >
                      {estadoStock}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        material.activo
                          ? 'status ready'
                          : 'status cancelled'
                      }
                    >
                      {material.activo
                        ? 'Activo'
                        : 'Inactivo'}
                    </span>
                  </td>

                  <td>

                    <div className="client-actions">

                      <button
                        className="text-btn"
                        onClick={() =>
                          abrirEditar(material)
                        }
                      >
                        Editar
                      </button>

                      <button
                        className="text-btn"
                        onClick={() =>
                          cambiarEstado(material)
                        }
                      >
                        {material.activo
                          ? 'Desactivar'
                          : 'Reactivar'}
                      </button>

                    </div>

                  </td>

                </tr>
              )

            })}


            {materiales.length === 0 && (

              <tr>

                <td
                  colSpan="8"
                  className="empty-table"
                >
                  No se encontraron materiales.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default TablaMateriales
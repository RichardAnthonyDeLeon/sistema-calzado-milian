function VariantesProductoModal({
  producto,
  cerrarModal
}) {
  if (!producto) {
    return null
  }

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

        <p className="eyebrow">
          Productos
        </p>

        <h3 className="modal-title">
          Variantes de {producto.nombre}
        </h3>

        <div className="product-variant-summary">

          <div>
            <small>Categoría</small>
            <strong>{producto.categoria}</strong>
          </div>

          <div>
            <small>Precio base</small>
            <strong>
              Q {Number(producto.precioBase).toFixed(2)}
            </strong>
          </div>

          <div>
            <small>Total variantes</small>
            <strong>
              {producto.variantes.length}
            </strong>
          </div>

        </div>

        <div className="table-wrap product-variants-table">

          <table>

            <thead>
              <tr>
                <th>Talla</th>
                <th>Color</th>
                <th>Material</th>
                <th>Suela</th>
                <th>Precio</th>
                <th>Existencia</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>

              {producto.variantes.map(variante => (

                <tr key={variante.id}>

                  <td>
                    <strong>
                      {variante.talla}
                    </strong>
                  </td>

                  <td>
                    {variante.color}
                  </td>

                  <td>
                    {variante.material}
                  </td>

                  <td>
                    {variante.suela}
                  </td>

                  <td>
                    Q {Number(variante.precio).toFixed(2)}
                  </td>

                  <td>
                    {variante.stock} pares
                  </td>

                  <td>

                    <span
                      className={
                        variante.activo
                          ? 'status ready'
                          : 'status cancelled'
                      }
                    >
                      {variante.activo
                        ? 'Activo'
                        : 'Inactivo'}
                    </span>

                  </td>

                </tr>

              ))}

              {producto.variantes.length === 0 && (

                <tr>

                  <td
                    colSpan="7"
                    className="empty-table"
                  >
                    Este producto todavía no tiene variantes registradas.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        <div className="form-actions">

          <button
            type="button"
            className="btn btn-outline"
            onClick={cerrarModal}
          >
            Cerrar
          </button>

        </div>

      </div>

    </div>
  )
}

export default VariantesProductoModal
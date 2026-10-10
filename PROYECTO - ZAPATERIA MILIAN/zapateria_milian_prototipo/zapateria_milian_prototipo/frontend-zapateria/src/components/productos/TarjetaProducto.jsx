function TarjetaProducto({
  producto,
  abrirFichaTecnica,
  abrirVariantes,
  abrirVariante,
  abrirEditar,
  cambiarEstado
}) {
  return (
    <article className="product-card">

      <div className="product-image">

        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
          />
        ) : (
          <div className="product-image-placeholder">
            Sin imagen
          </div>
        )}

      </div>

      <div className="product-body">

        <div className="product-card-header">

          <div>

            <p className="eyebrow">
              {producto.categoria}
            </p>

            <h3>
              {producto.nombre}
            </h3>

          </div>

          <span
            className={
              producto.activo
                ? 'status ready'
                : 'status cancelled'
            }
          >
            {producto.activo
              ? 'Activo'
              : 'Inactivo'}
          </span>

        </div>

        <p>
          {producto.descripcion || 'Sin descripción'}
        </p>

        <div className="product-info">

          <div>

            <small>
              Precio base
            </small>

            <strong>
              Q {Number(producto.precioBase).toFixed(2)}
            </strong>

          </div>

          <div>

            <small>
              Variantes
            </small>

            <strong>
              {producto.variantes.length}
            </strong>

          </div>

        </div>

        <div className="product-card-actions">

          <button
            className="btn btn-outline"
            onClick={() => abrirFichaTecnica(producto)}
            disabled={!producto.activo}
          >
            Ficha técnica
          </button>

          <button
            className="btn btn-outline"
            onClick={() =>
              abrirVariantes(producto)
            }
          >
            Ver variantes
          </button>

          <button
            className="btn btn-outline"
            onClick={() =>
              abrirVariante(producto)
            }
            disabled={!producto.activo}
          >
            + Variante
          </button>

          <button
            className="btn btn-outline"
            onClick={() =>
              abrirEditar(producto)
            }
          >
            Editar
          </button>

          <button
            className="text-btn"
            onClick={() =>
              cambiarEstado(producto)
            }
          >
            {producto.activo
              ? 'Desactivar'
              : 'Reactivar'}
          </button>

        </div>

      </div>

    </article>
  )
}

export default TarjetaProducto

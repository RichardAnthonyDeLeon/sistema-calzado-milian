function ProductosVendidos({
  productos
}) {
  return (
    <div className="panel report-panel">

      <div className="panel-header">

        <div>
          <p className="eyebrow">
            Productos
          </p>

          <h3>
            Más vendidos
          </h3>
        </div>

      </div>

      <div className="ranking-list">

        {productos.map(
          (producto, indice) => (

            <div
              className="ranking-item"
              key={producto.nombre}
            >

              <span className="ranking-number">
                {indice + 1}
              </span>

              <div>
                <strong>
                  {producto.nombre}
                </strong>

                <small>
                  {producto.cantidad} pares vendidos
                </small>
              </div>

              <strong>
                Q {producto.total.toFixed(2)}
              </strong>

            </div>

          )
        )}

      </div>

    </div>
  )
}

export default ProductosVendidos
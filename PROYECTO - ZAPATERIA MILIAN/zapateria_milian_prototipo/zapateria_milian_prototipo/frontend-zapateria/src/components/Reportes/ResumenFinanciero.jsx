function ResumenFinanciero({
  ingresos,
  creditosPendientes,
  valorInventario,
  paresProducidos
}) {
  return (
    <div className="panel report-panel">

      <div className="panel-header">

        <div>
          <p className="eyebrow">
            Resumen
          </p>

          <h3>
            Indicadores generales
          </h3>
        </div>

      </div>

      <div className="financial-list">

        <div className="financial-item">

          <div>
            <strong>
              Ingresos por ventas
            </strong>

            <small>
              Ventas pagadas
            </small>
          </div>

          <strong>
            Q {ingresos.toFixed(2)}
          </strong>

        </div>


        <div className="financial-item">

          <div>
            <strong>
              Créditos pendientes
            </strong>

            <small>
              Saldo por cobrar
            </small>
          </div>

          <strong>
            Q {creditosPendientes.toFixed(2)}
          </strong>

        </div>


        <div className="financial-item">

          <div>
            <strong>
              Inventario de materiales
            </strong>

            <small>
              Valor aproximado
            </small>
          </div>

          <strong>
            Q {valorInventario.toFixed(2)}
          </strong>

        </div>


        <div className="financial-item">

          <div>
            <strong>
              Producción
            </strong>

            <small>
              Pares terminados
            </small>
          </div>

          <strong>
            {paresProducidos} pares
          </strong>

        </div>

      </div>

    </div>
  )
}

export default ResumenFinanciero
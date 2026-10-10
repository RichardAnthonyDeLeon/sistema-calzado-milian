function ResumenReportes({
  ventas,
  ingresos,
  pedidos,
  producidos
}) {
  return (
    <div className="summary-strip">

      <div className="summary-box">
        <small>Ventas</small>
        <strong>{ventas}</strong>
      </div>

      <div className="summary-box">
        <small>Ingresos</small>
        <strong>
          Q {ingresos.toFixed(2)}
        </strong>
      </div>

      <div className="summary-box">
        <small>Pedidos</small>
        <strong>{pedidos}</strong>
      </div>

      <div className="summary-box">
        <small>Pares producidos</small>
        <strong>{producidos}</strong>
      </div>

    </div>
  )
}

export default ResumenReportes
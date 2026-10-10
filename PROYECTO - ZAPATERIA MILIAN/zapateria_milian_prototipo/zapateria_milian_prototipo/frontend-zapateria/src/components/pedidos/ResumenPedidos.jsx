function ResumenPedidos({
  totalPedidos,
  pedidosPendientes,
  pedidosProduccion,
  pedidosListos
}) {
  return (
    <div className="summary-grid">

      <div className="summary-card">
        <span>Total de pedidos</span>

        <strong>
          {totalPedidos}
        </strong>

        <small>
          Pedidos registrados
        </small>
      </div>


      <div className="summary-card">
        <span>Confirmados</span>

        <strong>
          {pedidosPendientes}
        </strong>

        <small>
          Confirmados para producción
        </small>
      </div>


      <div className="summary-card">
        <span>En producción</span>

        <strong>
          {pedidosProduccion}
        </strong>

        <small>
          Actualmente en proceso
        </small>
      </div>


      <div className="summary-card">
        <span>Listos</span>

        <strong>
          {pedidosListos}
        </strong>

        <small>
          Pedidos terminados
        </small>
      </div>

    </div>
  )
}

export default ResumenPedidos

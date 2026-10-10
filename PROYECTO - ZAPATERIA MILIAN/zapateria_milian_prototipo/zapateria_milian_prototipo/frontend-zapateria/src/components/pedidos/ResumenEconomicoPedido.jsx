function ResumenEconomicoPedido({
  totalPedido,
  saldoPendiente,
  anticipo
}) {
  return (
    <div className="pedido-resumen">

      <div>
        <small>
          Total del pedido
        </small>

        <strong>
          Q {Number(totalPedido || 0).toFixed(2)}
        </strong>
      </div>


      <div>
        <small>
          Anticipo
        </small>

        <strong>
          Q {Number(anticipo || 0).toFixed(2)}
        </strong>
      </div>


      <div>
        <small>
          Saldo pendiente
        </small>

        <strong>
          Q {Number(saldoPendiente || 0).toFixed(2)}
        </strong>
      </div>

    </div>
  )
}

export default ResumenEconomicoPedido
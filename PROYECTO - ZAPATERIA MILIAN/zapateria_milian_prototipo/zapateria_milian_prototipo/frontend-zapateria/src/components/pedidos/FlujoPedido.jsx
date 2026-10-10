function FlujoPedido() {
  return (
    <div className="panel">

      <div className="panel-header">
        <div>
          <p className="eyebrow">
            Flujo
          </p>

          <h3>
            Proceso del pedido
          </h3>
        </div>
      </div>


      <div className="order-flow">

        <div className="order-flow-item">
          <span>1</span>
          <strong>Pedido</strong>
          <small>Registro del cliente y modelo</small>
        </div>


        <div className="order-flow-arrow">
          →
        </div>


        <div className="order-flow-item">
          <span>2</span>
          <strong>Producción</strong>
          <small>Fabricación por lotes</small>
        </div>


        <div className="order-flow-arrow">
          →
        </div>


        <div className="order-flow-item">
          <span>3</span>
          <strong>Producto listo</strong>
          <small>Ingreso de pares terminados</small>
        </div>


        <div className="order-flow-arrow">
          →
        </div>


        <div className="order-flow-item">
          <span>4</span>
          <strong>Venta</strong>
          <small>Entrega y comprobante</small>
        </div>

      </div>

    </div>
  )
}

export default FlujoPedido
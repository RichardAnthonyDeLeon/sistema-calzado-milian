function DetallePedidoModal({
  pedido,
  claseEstado,
  cerrarModal
}) {

  const cantidadTotal =
    pedido.tallas.reduce(
      (total, item) =>
        total +
        Number(item.cantidad),
      0
    )


  return (
    <div className="modal show">

      <div
        className="modal-backdrop"
        onClick={cerrarModal}
      />


      <div className="modal-card pedido-detail-modal">

        <button
          className="modal-close"
          onClick={cerrarModal}
        >
          ×
        </button>


        <div className="pedido-detail-header">

          <div>

            <p className="eyebrow">
              Detalle del pedido
            </p>

            <h3 className="modal-title">
              {pedido.id}
            </h3>

          </div>


          <span
            className={
              claseEstado(
                pedido.estado
              )
            }
          >
            {pedido.estado}
          </span>

        </div>


        <div className="pedido-detail-grid">

          <div>
            <small>
              Cliente
            </small>

            <strong>
              {pedido.cliente}
            </strong>
          </div>


          <div>
            <small>
              Fecha de entrega
            </small>

            <strong>
              {pedido.fechaEntrega}
            </strong>
          </div>


          <div>
            <small>
              Modelo
            </small>

            <strong>
              {pedido.modelo}
            </strong>
          </div>


          <div>
            <small>
              Color
            </small>

            <strong>
              {pedido.color || '—'}
            </strong>
          </div>


          <div>
            <small>
              Material principal
            </small>

            <strong>
              {pedido.materialPrincipal || '—'}
            </strong>
          </div>


          <div>
            <small>
              Suela
            </small>

            <strong>
              {pedido.tipoSuela || '—'}
            </strong>
          </div>

        </div>


        <div className="pedido-detail-section">

          <div className="section-header-inline">

            <div>

              <p className="eyebrow">
                Distribución
              </p>

              <h3>
                Tallas solicitadas
              </h3>

            </div>


            <strong>
              {cantidadTotal} pares
            </strong>

          </div>


          <div className="table-wrap">

            <table>

              <thead>
                <tr>
                  <th>Talla</th>
                  <th>Cantidad</th>
                </tr>
              </thead>


              <tbody>

                {pedido.tallas.map(
                  item => (

                    <tr key={item.id}>

                      <td>
                        <strong>
                          Talla {item.talla}
                        </strong>
                      </td>

                      <td>
                        {item.cantidad} pares
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>


        <div className="pedido-detail-section">

          <p className="eyebrow">
            Personalización
          </p>

          <h3>
            Características del pedido
          </h3>


          <div className="pedido-description">

            {pedido.descripcion ||
              'No se registraron características especiales.'}

          </div>

        </div>


        <div className="pedido-detail-section">

          <p className="eyebrow">
            Información económica
          </p>

          <h3>
            Pago del pedido
          </h3>


          <div className="pedido-detail-financial">

            <div>
              <small>
                Precio unitario
              </small>

              <strong>
                Q {Number(
                  pedido.precioUnitario
                ).toFixed(2)}
              </strong>
            </div>


            <div>
              <small>
                Total
              </small>

              <strong>
                Q {Number(
                  pedido.total
                ).toFixed(2)}
              </strong>
            </div>


            <div>
              <small>
                Anticipo
              </small>

              <strong>
                Q {Number(
                  pedido.anticipo
                ).toFixed(2)}
              </strong>
            </div>


            <div>
              <small>
                Saldo
              </small>

              <strong>
                Q {Number(
                  pedido.saldo
                ).toFixed(2)}
              </strong>
            </div>

          </div>


          <div className="pedido-payment-info">

            <span>
              Forma de pago
            </span>

            <strong>
              {pedido.tipoPago}

              {pedido.tipoPago ===
                'Crédito' &&
                ` · ${pedido.numeroPagos} pagos`}
            </strong>

          </div>

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


export default DetallePedidoModal
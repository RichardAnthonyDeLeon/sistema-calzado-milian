import HistorialAbonos from './HistorialAbonos'


function ProgresoCredito({
  credito,
  abonos,
  claseEstado,
  abrirAbono,
  cerrarModal
}) {

  const abonado =
    Number(credito.total) -
    Number(credito.saldo)


  const porcentaje =
    credito.total > 0
      ? Math.min(
          Math.round(
            (
              abonado /
              credito.total
            ) * 100
          ),
          100
        )
      : 0


  return (
    <div className="modal show">

      <div
        className="modal-backdrop"
        onClick={cerrarModal}
      />


      <div className="modal-card credit-detail-modal">

        <button
          className="modal-close"
          onClick={cerrarModal}
        >
          ×
        </button>


        <div className="pedido-detail-header">

          <div>

            <p className="eyebrow">
              Crédito
            </p>

            <h3 className="modal-title">
              {credito.id}
            </h3>

          </div>


          <span
            className={
              claseEstado(
                credito.estado
              )
            }
          >
            {credito.estado}
          </span>

        </div>


        <div className="credit-detail-grid">

          <div>

            <small>
              Cliente
            </small>

            <strong>
              {credito.cliente}
            </strong>

          </div>


          <div>

            <small>
              Pedido
            </small>

            <strong>
              {credito.pedidoId}
            </strong>

          </div>


          <div>

            <small>
              Venta
            </small>

            <strong>
              {credito.ventaId}
            </strong>

          </div>


          <div>

            <small>
              Fecha
            </small>

            <strong>
              {credito.fecha}
            </strong>

          </div>


          <div>

            <small>
              Plan acordado
            </small>

            <strong>
              {credito.numeroPagos} pagos
            </strong>

          </div>

        </div>


        <div className="credit-financial-grid">

          <div>

            <small>
              Monto original
            </small>

            <strong>
              Q {Number(
                credito.total
              ).toFixed(2)}
            </strong>

          </div>


          <div>

            <small>
              Total abonado
            </small>

            <strong>
              Q {Number(
                abonado
              ).toFixed(2)}
            </strong>

          </div>


          <div>

            <small>
              Saldo pendiente
            </small>

            <strong>
              Q {Number(
                credito.saldo
              ).toFixed(2)}
            </strong>

          </div>

        </div>


        <div className="credit-progress-section">

          <div className="production-progress-info">

            <span>
              Progreso del crédito
            </span>

            <strong>
              {porcentaje}%
            </strong>

          </div>


          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width:
                  `${porcentaje}%`
              }}
            />

          </div>


          <div className="credit-progress-footer">

            <span>
              Q {abonado.toFixed(2)} pagados
            </span>

            <span>
              Q {Number(
                credito.saldo
              ).toFixed(2)} pendientes
            </span>

          </div>

        </div>


        <div className="credit-detail-actions">

          {credito.estado ===
            'Activo' && (

            <button
              className="btn btn-gold"
              onClick={() =>
                abrirAbono(
                  credito
                )
              }
            >
              + Registrar abono
            </button>

          )}

        </div>


        <HistorialAbonos
          abonos={abonos}
        />

      </div>

    </div>
  )
}


export default ProgresoCredito
function ResumenCreditos({
  saldoPendiente,
  creditosActivos,
  totalAbonado
}) {

  return (
    <div className="summary-grid">

      <div className="summary-card">

        <span>
          Saldo pendiente
        </span>

        <strong>
          Q {Number(
            saldoPendiente
          ).toFixed(2)}
        </strong>

        <small>
          Por cobrar
        </small>

      </div>


      <div className="summary-card">

        <span>
          Créditos activos
        </span>

        <strong>
          {creditosActivos}
        </strong>

        <small>
          Con saldo pendiente
        </small>

      </div>


      <div className="summary-card">

        <span>
          Total abonado
        </span>

        <strong>
          Q {Number(
            totalAbonado
          ).toFixed(2)}
        </strong>

        <small>
          Pagos recibidos
        </small>

      </div>

    </div>
  )
}


export default ResumenCreditos
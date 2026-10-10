function ResumenProduccion({
  ordenesActivas,
  paresPendientes,
  ordenesCompletadas
}) {

  return (
    <div className="summary-grid">

      <div className="summary-card">

        <span>
          Órdenes activas
        </span>

        <strong>
          {ordenesActivas}
        </strong>

        <small>
          Pendientes y en producción
        </small>

      </div>


      <div className="summary-card">

        <span>
          Pares pendientes
        </span>

        <strong>
          {paresPendientes}
        </strong>

        <small>
          Aún faltan por producir
        </small>

      </div>


      <div className="summary-card">

        <span>
          Completadas
        </span>

        <strong>
          {ordenesCompletadas}
        </strong>

        <small>
          Órdenes finalizadas
        </small>

      </div>

    </div>
  )
}


export default ResumenProduccion
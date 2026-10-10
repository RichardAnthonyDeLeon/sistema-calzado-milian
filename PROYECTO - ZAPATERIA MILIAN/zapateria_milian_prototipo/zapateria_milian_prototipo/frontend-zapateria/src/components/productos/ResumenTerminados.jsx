function ResumenTerminados({
  inventario
}) {

  const totalPares =
    inventario.reduce(
      (total, item) =>
        total +
        Number(item.existencia),
      0
    )


  const modelos =
    new Set(
      inventario
        .filter(
          item =>
            Number(
              item.existencia
            ) > 0
        )
        .map(
          item =>
            item.modelo
        )
    ).size


  const tallas =
    new Set(
      inventario
        .filter(
          item =>
            Number(
              item.existencia
            ) > 0
        )
        .map(
          item =>
            item.talla
        )
    ).size


  const sinExistencia =
    inventario.filter(
      item =>
        Number(
          item.existencia
        ) <= 0
    ).length


  return (
    <div className="summary-grid">

      <div className="summary-card">

        <span>
          Pares terminados
        </span>

        <strong>
          {totalPares}
        </strong>

        <small>
          Existencia disponible
        </small>

      </div>


      <div className="summary-card">

        <span>
          Modelos
        </span>

        <strong>
          {modelos}
        </strong>

        <small>
          Con existencia
        </small>

      </div>


      <div className="summary-card">

        <span>
          Tallas
        </span>

        <strong>
          {tallas}
        </strong>

        <small>
          Con existencia
        </small>

      </div>


      <div className="summary-card">

        <span>
          Sin existencia
        </span>

        <strong>
          {sinExistencia}
        </strong>

        <small>
          Variantes agotadas
        </small>

      </div>

    </div>
  )
}


export default ResumenTerminados
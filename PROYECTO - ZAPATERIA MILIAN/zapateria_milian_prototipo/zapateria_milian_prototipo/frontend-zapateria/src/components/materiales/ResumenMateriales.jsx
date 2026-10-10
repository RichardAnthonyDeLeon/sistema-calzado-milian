function ResumenMateriales({
  totalMateriales,
  materialesBajoStock,
  valorInventario
}) {
  return (
    <div className="summary-strip">

      <div className="summary-box">
        <small>Materiales registrados</small>
        <strong>{totalMateriales}</strong>
      </div>

      <div className="summary-box">
        <small>Bajo stock</small>
        <strong>{materialesBajoStock}</strong>
      </div>

      <div className="summary-box">
        <small>Valor del inventario</small>
        <strong>
          Q {valorInventario.toFixed(2)}
        </strong>
      </div>

    </div>
  )
}

export default ResumenMateriales
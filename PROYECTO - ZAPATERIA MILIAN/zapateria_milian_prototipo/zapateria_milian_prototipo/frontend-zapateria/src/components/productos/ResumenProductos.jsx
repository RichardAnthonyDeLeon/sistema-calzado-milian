function ResumenProductos({
  totalProductos,
  totalVariantes,
  productosActivos
}) {
  return (
    <div className="summary-strip">

      <div className="summary-box">
        <small>Modelos registrados</small>
        <strong>{totalProductos}</strong>
      </div>

      <div className="summary-box">
        <small>Variantes</small>
        <strong>{totalVariantes}</strong>
      </div>

      <div className="summary-box">
        <small>Modelos activos</small>
        <strong>{productosActivos}</strong>
      </div>

    </div>
  )
}

export default ResumenProductos
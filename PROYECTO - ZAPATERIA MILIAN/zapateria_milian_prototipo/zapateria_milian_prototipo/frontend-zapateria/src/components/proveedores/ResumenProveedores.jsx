function ResumenProveedores({
  totalProveedores,
  proveedoresActivos,
  proveedoresInactivos
}) {
  return (
    <div className="summary-strip">

      <div className="summary-box">
        <small>Proveedores registrados</small>
        <strong>{totalProveedores}</strong>
      </div>

      <div className="summary-box">
        <small>Proveedores activos</small>
        <strong>{proveedoresActivos}</strong>
      </div>

      <div className="summary-box">
        <small>Proveedores inactivos</small>
        <strong>{proveedoresInactivos}</strong>
      </div>

    </div>
  )
}

export default ResumenProveedores
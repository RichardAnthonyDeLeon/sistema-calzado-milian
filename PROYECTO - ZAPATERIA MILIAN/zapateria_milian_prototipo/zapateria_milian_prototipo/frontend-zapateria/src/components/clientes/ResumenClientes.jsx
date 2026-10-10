function ResumenClientes({
  totalClientes,
  clientesActivos,
  clientesInactivos
}) {
  return (
    <div className="summary-strip">

      <div className="summary-box">
        <small>Clientes registrados</small>
        <strong>{totalClientes}</strong>
      </div>

      <div className="summary-box">
        <small>Clientes activos</small>
        <strong>{clientesActivos}</strong>
      </div>

      <div className="summary-box">
        <small>Clientes inactivos</small>
        <strong>{clientesInactivos}</strong>
      </div>

    </div>
  )
}

export default ResumenClientes
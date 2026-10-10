function FiltrosReportes({
  periodo,
  setPeriodo
}) {
  return (
    <div className="report-actions">

      <div className="report-period">

        <label>
          Período
        </label>

        <select
          value={periodo}
          onChange={evento =>
            setPeriodo(evento.target.value)
          }
        >
          <option value="Semana">
            Esta semana
          </option>

          <option value="Mes">
            Este mes
          </option>

          <option value="Trimestre">
            Este trimestre
          </option>

          <option value="Año">
            Este año
          </option>

        </select>

      </div>

      <button
        className="btn btn-outline"
        onClick={() => window.print()}
      >
        Imprimir reporte
      </button>

    </div>
  )
}

export default FiltrosReportes
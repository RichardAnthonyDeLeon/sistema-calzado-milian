function EstadoMateriales({
  materiales
}) {
  return (
    <div className="panel report-panel">

      <div className="panel-header">

        <div>
          <p className="eyebrow">
            Inventario
          </p>

          <h3>
            Estado de materiales
          </h3>
        </div>

      </div>

      <div className="financial-list">

        {materiales.map(material => (

          <div
            className="financial-item"
            key={material.nombre}
          >

            <div>

              <strong>
                {material.nombre}
              </strong>

              <small>
                {material.existencia}{' '}
                {material.unidad} disponibles
              </small>

            </div>

            <span
              className={
                material.estado === 'Normal'
                  ? 'status ready'
                  : material.estado === 'Atención'
                    ? 'status pending'
                    : 'status cancelled'
              }
            >
              {material.estado}
            </span>

          </div>

        ))}

      </div>

    </div>
  )
}

export default EstadoMateriales
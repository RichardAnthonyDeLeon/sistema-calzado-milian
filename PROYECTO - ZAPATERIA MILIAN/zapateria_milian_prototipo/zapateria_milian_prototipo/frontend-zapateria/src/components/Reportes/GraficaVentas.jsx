function GraficaVentas({
  datos
}) {

  const maximo =
    Math.max(
      ...datos.map(item => item.valor),
      1
    )

  return (
    <div className="panel report-panel">

      <div className="panel-header">

        <div>
          <p className="eyebrow">
            Ventas
          </p>

          <h3>
            Comportamiento de ventas
          </h3>
        </div>

      </div>

      <div className="bar-chart">

        {datos.map(item => {

          const porcentaje =
            (item.valor / maximo) * 100

          return (
            <div
              className="bar-item"
              key={item.nombre}
            >

              <div className="bar-value">
                Q {item.valor.toFixed(0)}
              </div>

              <div className="bar-track">

                <div
                  className="bar-fill"
                  style={{
                    height:
                      `${Math.max(
                        porcentaje,
                        4
                      )}%`
                  }}
                />

              </div>

              <small>
                {item.nombre}
              </small>

            </div>
          )
        })}

      </div>

    </div>
  )
}

export default GraficaVentas
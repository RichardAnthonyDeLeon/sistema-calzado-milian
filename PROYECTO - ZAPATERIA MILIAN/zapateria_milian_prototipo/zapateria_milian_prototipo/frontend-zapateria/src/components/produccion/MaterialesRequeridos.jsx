function MaterialesRequeridos({
  materiales
}) {
  if (!materiales.length) {
    return null
  }


  return (
    <div className="production-lotes">

      <div className="panel-header">

        <div>
          <p className="eyebrow">
            Materiales
          </p>

          <h3>
            Materiales requeridos
          </h3>
        </div>

      </div>


      <div className="table-wrap">

        <table>

          <thead>
            <tr>
              <th>Material</th>
              <th>Consumo por par</th>
              <th>Requerido</th>
              <th>Disponible</th>
              <th>Estado</th>
            </tr>
          </thead>


          <tbody>

            {materiales.map(material => (

              <tr key={material.id}>

                <td>
                  <strong>
                    {material.nombre}
                  </strong>
                </td>


                <td>
                  {material.consumoPorPar} {material.unidad}
                </td>


                <td>
                  {Number(
                    material.requerido
                  ).toFixed(2)} {material.unidad}
                </td>


                <td>
                  {Number(
                    material.existencia
                  ).toFixed(2)} {material.unidad}
                </td>


                <td>

                  <span
                    className={
                      material.disponible
                        ? 'status ready'
                        : 'status cancelled'
                    }
                  >
                    {material.disponible
                      ? 'Disponible'
                      : 'Insuficiente'}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}


export default MaterialesRequeridos
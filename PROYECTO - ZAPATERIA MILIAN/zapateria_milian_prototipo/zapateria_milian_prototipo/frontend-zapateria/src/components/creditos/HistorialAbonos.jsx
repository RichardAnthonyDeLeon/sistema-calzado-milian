function HistorialAbonos({
  abonos
}) {

  const totalAbonos =
    abonos.reduce(
      (total, abono) =>
        total +
        Number(abono.monto),
      0
    )


  return (
    <div className="credit-history">

      <div className="section-header-inline">

        <div>

          <p className="eyebrow">
            Historial
          </p>

          <h3>
            Abonos registrados
          </h3>

        </div>


        <strong>
          Q {totalAbonos.toFixed(2)}
        </strong>

      </div>


      <div className="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Abono</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Observación</th>
            </tr>

          </thead>


          <tbody>

            {abonos.map(
              abono => (

                <tr key={abono.id}>

                  <td>
                    <strong>
                      {abono.id}
                    </strong>
                  </td>

                  <td>
                    {abono.fecha}
                  </td>

                  <td>
                    Q {Number(
                      abono.monto
                    ).toFixed(2)}
                  </td>

                  <td>
                    {abono.observacion}
                  </td>

                </tr>

              )
            )}


            {abonos.length === 0 && (

              <tr>

                <td
                  colSpan="4"
                  className="empty-table"
                >
                  Este crédito todavía no tiene abonos registrados.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}


export default HistorialAbonos
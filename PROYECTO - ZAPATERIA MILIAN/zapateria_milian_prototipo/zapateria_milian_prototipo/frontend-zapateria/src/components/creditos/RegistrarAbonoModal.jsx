import { useState } from 'react'


function RegistrarAbonoModal({
  creditos,
  creditoInicial,
  guardar,
  cerrarModal
}) {

  const [creditoId, setCreditoId] =
    useState(
      creditoInicial?.id || ''
    )

  const [fecha, setFecha] =
    useState('')

  const [monto, setMonto] =
    useState('')

  const [observacion, setObservacion] =
    useState('')


  const creditoSeleccionado =
    creditos.find(
      credito =>
        credito.id ===
        creditoId
    )


  function enviar(evento) {

    evento.preventDefault()


    guardar({
      creditoId,
      fecha,
      monto,
      observacion
    })
  }


  return (
    <div className="modal show">

      <div
        className="modal-backdrop"
        onClick={cerrarModal}
      />


      <div className="modal-card">

        <button
          className="modal-close"
          onClick={cerrarModal}
        >
          ×
        </button>


        <p className="eyebrow">
          Créditos
        </p>

        <h3 className="modal-title">
          Registrar abono
        </h3>


        <form onSubmit={enviar}>

          <div className="form-group">

            <label>
              Crédito
            </label>

            <select
              value={creditoId}
              onChange={
                evento =>
                  setCreditoId(
                    evento.target.value
                  )
              }
              disabled={
                Boolean(
                  creditoInicial
                )
              }
              required
            >

              <option value="">
                Seleccionar crédito
              </option>


              {creditos.map(
                credito => (

                  <option
                    key={credito.id}
                    value={credito.id}
                  >
                    {credito.id}
                    {' - '}
                    {credito.cliente}
                    {' - '}
                    Q {Number(
                      credito.saldo
                    ).toFixed(2)}
                  </option>

                )
              )}

            </select>

          </div>


          {creditoSeleccionado && (

            <div className="credit-payment-summary">

              <div>

                <small>
                  Cliente
                </small>

                <strong>
                  {creditoSeleccionado.cliente}
                </strong>

              </div>


              <div>

                <small>
                  Crédito original
                </small>

                <strong>
                  Q {Number(
                    creditoSeleccionado.total
                  ).toFixed(2)}
                </strong>

              </div>


              <div>

                <small>
                  Saldo pendiente
                </small>

                <strong>
                  Q {Number(
                    creditoSeleccionado.saldo
                  ).toFixed(2)}
                </strong>

              </div>

            </div>

          )}


          <div className="form-grid">

            <div className="form-group">

              <label>
                Fecha
              </label>

              <input
                type="date"
                value={fecha}
                onChange={
                  evento =>
                    setFecha(
                      evento.target.value
                    )
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Monto del abono
              </label>

              <input
                type="number"
                min="0.01"
                step="0.01"
                max={
                  creditoSeleccionado
                    ? creditoSeleccionado.saldo
                    : undefined
                }
                value={monto}
                onChange={
                  evento =>
                    setMonto(
                      evento.target.value
                    )
                }
                required
              />

            </div>

          </div>


          <div className="form-group">

            <label>
              Observación
            </label>

            <textarea
              rows="3"
              value={observacion}
              onChange={
                evento =>
                  setObservacion(
                    evento.target.value
                  )
              }
              placeholder="Ej. Segundo pago del crédito..."
            />

          </div>


          {creditoSeleccionado &&
            Number(monto) > 0 && (

            <div className="credit-after-payment">

              <span>
                Saldo después del abono
              </span>

              <strong>
                Q {Math.max(
                  creditoSeleccionado.saldo -
                  Number(monto),
                  0
                ).toFixed(2)}
              </strong>

            </div>

          )}


          <div className="form-actions">

            <button
              type="button"
              className="btn btn-outline"
              onClick={cerrarModal}
            >
              Cancelar
            </button>


            <button
              type="submit"
              className="btn btn-gold"
            >
              Registrar abono
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}


export default RegistrarAbonoModal
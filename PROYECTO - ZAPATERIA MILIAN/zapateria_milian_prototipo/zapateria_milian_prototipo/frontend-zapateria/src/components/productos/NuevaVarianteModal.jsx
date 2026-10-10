import { useState } from 'react'


function NuevaVarianteModal({
  producto,
  materiales,
  guardarVariante,
  cerrarModal
}) {

  const [formulario, setFormulario] =
    useState({

      talla:
        '',

      color:
        '',

      material:
        '',

      suela:
        '',

      precio:
        producto?.precioBase || '',

    })


  function manejarCambio(evento) {

    const {
      name,
      value
    } = evento.target


    setFormulario({

      ...formulario,

      [name]:
        value

    })
  }


  function manejarSubmit(evento) {

    evento.preventDefault()

    guardarVariante(
      formulario
    )
  }


  return (

    <div className="modal show">

      <div
        className="modal-backdrop"
        onClick={
          cerrarModal
        }
      />


      <div className="modal-card">

        <button
          type="button"
          className="modal-close"
          onClick={
            cerrarModal
          }
        >
          ×
        </button>


        <p className="eyebrow">
          Variantes
        </p>


        <h3 className="modal-title">
          Nueva variante
        </h3>


        <div className="note">

          Modelo:{' '}

          <strong>
            {producto?.nombre}
          </strong>

        </div>


        <form
          onSubmit={
            manejarSubmit
          }
        >

          <div className="form-grid">

            <div className="form-group">

              <label>
                Talla
              </label>

              <input
                type="number"
                name="talla"
                min="20"
                max="50"
                value={
                  formulario.talla
                }
                onChange={
                  manejarCambio
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Color
              </label>

              <input
                type="text"
                name="color"
                value={
                  formulario.color
                }
                onChange={
                  manejarCambio
                }
                placeholder="Ej. Negro"
                required
              />

            </div>


            <div className="form-group">

              <label>
                Material
              </label>

            <select
              name="material"
              value={
                formulario.material
              }
              onChange={
                manejarCambio
              }
              required
            >

              <option value="">
                Seleccione...
              </option>

              {materiales.map(
                material => (

                  <option
                    key={
                      material.id
                    }
                    value={
                      material.nombre
                    }
                  >
                    {material.nombre}
                  </option>

                )
              )}

            </select>

            </div>


            <div className="form-group">

              <label>
                Tipo de suela
              </label>

              <input
                type="text"
                name="suela"
                value={
                  formulario.suela
                }
                onChange={
                  manejarCambio
                }
                placeholder="Ej. Formal"
                required
              />

            </div>


            <div className="form-group">

              <label>
                Precio
              </label>

              <input
                type="number"
                name="precio"
                min="0"
                step="0.01"
                value={
                  formulario.precio
                }
                onChange={
                  manejarCambio
                }
                required
              />

            </div>

          </div>


          <div className="form-actions">

            <button
              type="button"
              className="btn btn-outline"
              onClick={
                cerrarModal
              }
            >
              Cancelar
            </button>


            <button
              type="submit"
              className="btn btn-gold"
            >
              Registrar variante
            </button>

          </div>

        </form>

      </div>

    </div>

  )
}


export default NuevaVarianteModal
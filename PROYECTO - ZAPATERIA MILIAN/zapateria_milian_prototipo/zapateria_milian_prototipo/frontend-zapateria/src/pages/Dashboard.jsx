function Dashboard({ cambiarVista }) {

  return (
    <section>

      {/* ============================= */}
      {/* BIENVENIDA */}
      {/* ============================= */}

      <div className="welcome-card">

        <div>

          <p className="eyebrow">
            Resumen del negocio
          </p>

          <h3>
            Buenos días, Administrador
          </h3>

          <p>
            Consulta rápidamente pedidos, producción,
            inventario, ventas y créditos de Calzado Milián.
          </p>

        </div>

        <div className="welcome-emblem">
          MILIAN
        </div>

      </div>


      {/* ============================= */}
      {/* INDICADORES PRINCIPALES */}
      {/* ============================= */}

      <div className="stats-grid">

        <article className="stat-card">

          <span className="stat-icon">
            Q
          </span>

          <div>
            <small>Ventas del mes</small>
            <strong>Q 18,450.00</strong>
            <em>12 ventas registradas</em>
          </div>

        </article>


        <article className="stat-card">

          <span className="stat-icon">
            ◈
          </span>

          <div>
            <small>Pedidos activos</small>
            <strong>8</strong>
            <em>3 actualmente en producción</em>
          </div>

        </article>


        <article className="stat-card warning">

          <span className="stat-icon">
            !
          </span>

          <div>
            <small>Materiales con stock bajo</small>
            <strong>4</strong>
            <em>Requieren reposición</em>
          </div>

        </article>


        <article className="stat-card">

          <span className="stat-icon">
            ◒
          </span>

          <div>
            <small>Saldo por cobrar</small>
            <strong>Q 7,250.00</strong>
            <em>5 créditos activos</em>
          </div>

        </article>

      </div>


      {/* ============================= */}
      {/* PEDIDOS + MATERIALES */}
      {/* ============================= */}

      <div className="dashboard-grid">

        {/* PEDIDOS */}

        <article className="panel span-2">

          <div className="panel-header">

            <div>

              <p className="eyebrow">
                Seguimiento
              </p>

              <h3>
                Pedidos activos
              </h3>

            </div>


            <button
              className="text-btn"
              onClick={() =>
                cambiarVista('pedidos')
              }
            >
              Ver pedidos →
            </button>

          </div>


          <div className="table-wrap">

            <table>

              <thead>

                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Entrega</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>

              </thead>


              <tbody>

                <tr>

                  <td>
                    #PED-1048
                  </td>

                  <td>
                    Calzado El Centro
                  </td>

                  <td>
                    20/09/2026
                  </td>

                  <td>
                    Q 5,000.00
                  </td>

                  <td>

                    <span className="status production">
                      En producción
                    </span>

                  </td>

                </tr>


                <tr>

                  <td>
                    #PED-1047
                  </td>

                  <td>
                    María López
                  </td>

                  <td>
                    15/09/2026
                  </td>

                  <td>
                    Q 2,880.00
                  </td>

                  <td>

                    <span className="status pending">
                      Pendiente
                    </span>

                  </td>

                </tr>


                <tr>

                  <td>
                    #PED-1046
                  </td>

                  <td>
                    Distribuidora Norte
                  </td>

                  <td>
                    10/09/2026
                  </td>

                  <td>
                    Q 3,750.00
                  </td>

                  <td>

                    <span className="status ready">
                      Listo
                    </span>

                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </article>


        {/* ALERTAS DE MATERIALES */}

        <article className="panel">

          <div className="panel-header">

            <div>

              <p className="eyebrow">
                Inventario
              </p>

              <h3>
                Materiales por reponer
              </h3>

            </div>

          </div>


          <div className="alert-list">

            <div>

              <span className="dot danger"></span>

              <div>

                <strong>
                  Cuero negro
                </strong>

                <small>
                  8 m² disponibles / mínimo 15 m²
                </small>

              </div>

            </div>


            <div>

              <span className="dot danger"></span>

              <div>

                <strong>
                  Suela formal
                </strong>

                <small>
                  12 unidades / mínimo 20
                </small>

              </div>

            </div>


            <div>

              <span className="dot warning-dot"></span>

              <div>

                <strong>
                  Pegamento industrial
                </strong>

                <small>
                  4 L disponibles / mínimo 5 L
                </small>

              </div>

            </div>


            <div>

              <span className="dot warning-dot"></span>

              <div>

                <strong>
                  Hilo encerado
                </strong>

                <small>
                  7 rollos disponibles / mínimo 8
                </small>

              </div>

            </div>

          </div>


          <button
            className="btn btn-dark full"
            onClick={() =>
              cambiarVista('materiales')
            }
          >
            Revisar inventario
          </button>

        </article>

      </div>


      {/* ============================= */}
      {/* ACCESOS RÁPIDOS */}
      {/* ============================= */}

      <div
        className="panel"
        style={{
          marginTop: '20px'
        }}
      >

        <div className="panel-header">

          <div>

            <p className="eyebrow">
              Operaciones
            </p>

            <h3>
              Accesos rápidos
            </h3>

          </div>

        </div>


        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >

          <button
            className="btn btn-gold"
            onClick={() =>
              cambiarVista('pedidos')
            }
          >
            Ver pedidos
          </button>


          <button
            className="btn btn-dark"
            onClick={() =>
              cambiarVista('produccion')
            }
          >
            Ver producción
          </button>


          <button
            className="btn btn-dark"
            onClick={() =>
              cambiarVista('ventas')
            }
          >
            Ver ventas
          </button>


          <button
            className="btn btn-dark"
            onClick={() =>
              cambiarVista('creditos')
            }
          >
            Ver créditos
          </button>


          <button
            className="btn btn-dark"
            onClick={() =>
              cambiarVista('reportes')
            }
          >
            Ver reportes
          </button>

        </div>

      </div>

    </section>
  )
}

export default Dashboard
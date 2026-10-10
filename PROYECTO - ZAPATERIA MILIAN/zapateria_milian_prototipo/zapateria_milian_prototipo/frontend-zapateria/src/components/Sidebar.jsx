function Sidebar({ vistaActiva, cambiarVista }) {

  const opciones = [
    { id: 'dashboard', icono: '▦', texto: 'Dashboard' },
    { id: 'clientes', icono: '♙', texto: 'Clientes' },
    { id: 'proveedores', icono: '▣', texto: 'Proveedores' },
    { id: 'materiales', icono: '◫', texto: 'Materiales' },
    { id: 'productos', icono: '◆', texto: 'Productos' },
    { id: 'pedidos', icono: '◈', texto: 'Pedidos' },
    { id: 'produccion', icono: '⚙', texto: 'Producción' },
    { id: 'ventas', icono: '¤', texto: 'Ventas' },
    { id: 'creditos', icono: '◒', texto: 'Créditos y abonos' },
    { id: 'reportes', icono: '⌁', texto: 'Reportes' }
  ]

  return (
    <aside className="sidebar">

      <div className="brand">

        <div className="brand-mark">
          ZM
        </div>

        <div>
          <h1>Zapatería Milian</h1>
          <span>Gestión & Producción</span>
        </div>

      </div>


      <nav className="nav">

        {opciones.map(opcion => (

          <button
            key={opcion.id}
            className={
              `nav-item ${
                vistaActiva === opcion.id
                  ? 'active'
                  : ''
              }`
            }
            onClick={() => cambiarVista(opcion.id)}
          >

            <span>{opcion.icono}</span>

            {opcion.texto}

          </button>

        ))}

      </nav>


      <div className="sidebar-footer">

        <div className="user-card">

          <div className="avatar">
            AM
          </div>

          <div>
            <strong>Administrador</strong>
            <small>Propietario</small>
          </div>

        </div>

      </div>

    </aside>
  )
}

export default Sidebar
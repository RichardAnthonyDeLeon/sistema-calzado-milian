function Topbar({ titulo, nuevaAccion }) {

  return (
    <header className="topbar">

      <div>

        <p className="eyebrow">
          Sistema Administrativo
        </p>

        <h2>
          {titulo}
        </h2>

      </div>


      <div className="topbar-actions">

        <button
          className="icon-btn"
          title="Notificaciones"
        >
          ●
        </button>


        <button
          className="btn btn-outline"
          onClick={nuevaAccion}
        >
          + Nuevo registro
        </button>

      </div>

    </header>
  )
}

export default Topbar
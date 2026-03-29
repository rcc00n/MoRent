import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink className="brand" to="/">
          Mo<span>Rent</span>
        </NavLink>
        <nav className="nav-links" aria-label="Primary">
          <NavLink
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
            end
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
            to="/catalog"
          >
            Catalog
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar

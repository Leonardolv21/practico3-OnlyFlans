import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function AppNavbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <Navbar bg="light" expand="lg" className="border-bottom">
      <Container>
        <Navbar.Brand as={Link} to="/">OnlyFlans</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/creators">Directorio Alfabético</Nav.Link>
            <Nav.Link as={Link} to="/creators/search">Buscar creadores</Nav.Link>
            {user?.role === 'creator' && (
              <>
                <Nav.Link as={Link} to="/creator/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/creator/income">Ingresos</Nav.Link>
              </>
            )}
            {user?.role === 'follower' && (
              <>
                <Nav.Link as={Link} to="/follower/feed">Feed</Nav.Link>
                <Nav.Link as={Link} to="/follower/favorites">Favoritos</Nav.Link>
                <Nav.Link as={Link} to="/follower/donations">Donaciones</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <NavDropdown title={user?.name || 'Cuenta'} align="end">
                <NavDropdown.ItemText>{user?.email}</NavDropdown.ItemText>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Cerrar sesion</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Ingresar</Nav.Link>
                <Nav.Link as={Link} to="/register">Registro</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar

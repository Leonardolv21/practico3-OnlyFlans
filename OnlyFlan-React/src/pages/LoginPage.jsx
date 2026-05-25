import { useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { loginSchema } from '../validation/schemas.js' // 👈 Verifica que esta ruta exista físicamente

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)
    try {
      // Validamos usando el esquema unificado de Yup
      const cleanForm = await loginSchema.validate(form, { abortEarly: false })
      const user = await login(cleanForm)
      navigate(user.role === 'creator' ? '/creator/dashboard' : '/follower/feed')
    } catch (apiError) {
      if (apiError.name === 'ValidationError') {
        const nextErrors = {}
        apiError.inner.forEach((issue) => {
          if (issue.path && !nextErrors[issue.path]) nextErrors[issue.path] = issue.message
        })
        setFieldErrors(nextErrors)
        return
      }
      setError(apiError.response?.data?.message || 'Credenciales inválidas. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Row className="justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
      <Col md={6} lg={4}>
        <Card className="border-0 shadow-sm p-3">
          <Card.Body>
            <div className="text-center mb-4">
              <h3 className="fw-bold text-dark m-0">¡Bienvenido de vuelta!</h3>
              <small className="text-muted">Ingresa a tu cuenta de OnlyFlans</small>
            </div>
            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-secondary">Correo Electrónico</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder=""
                  className="py-2"
                  isInvalid={Boolean(fieldErrors.email)} 
                  value={form.email} 
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} 
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.email}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="small fw-semibold text-secondary">Contraseña</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder=""
                  className="py-2"
                  isInvalid={Boolean(fieldErrors.password)} 
                  value={form.password} 
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} 
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.password}</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100 py-2 fw-semibold mb-3" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
              <div className="text-center">
                <Form.Text className="text-muted">
                  ¿No tienes una cuenta? <Link to="/register" className="text-decoration-none fw-semibold">Regístrate</Link>
                </Form.Text>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default LoginPage
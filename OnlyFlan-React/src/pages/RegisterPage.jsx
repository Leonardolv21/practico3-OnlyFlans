import { useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { registerSchema } from '../validation/schemas.js'

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'follower' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setFieldErrors({})
    setLoading(true)
    try {
      const cleanForm = await registerSchema.validate(form, { abortEarly: false })
      await register(cleanForm)
      setSuccess('¡Registro exitoso! Redirigiendo al login...')
      setTimeout(() => navigate('/login'), 1200)
    } catch (apiError) {
      if (apiError.name === 'ValidationError') {
        const nextErrors = {}
        apiError.inner.forEach((issue) => {
          if (issue.path && !nextErrors[issue.path]) nextErrors[issue.path] = issue.message
        })
        setFieldErrors(nextErrors)
        return
      }
      setError(apiError.response?.data?.message || 'Ocurrió un error al registrar la cuenta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Col md={7} lg={5}>
        <Card className="border-0 shadow-sm p-3">
          <Card.Body>
            <div className="text-center mb-4">
              <h3 className="fw-bold text-dark m-0">Registro</h3>
              <small className="text-muted">Elige tu rol y apoya o crea contenido</small>
            </div>
            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
            {success && <Alert variant="success" className="py-2 small">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-secondary">Nombre Completo</Form.Label>
                <Form.Control 
                  placeholder="Tu nombre"
                  className="py-2"
                  isInvalid={Boolean(fieldErrors.name)} 
                  value={form.name} 
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} 
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.name}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-secondary">Correo Electrónico</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="nombre@ejemplo.com"
                  className="py-2"
                  isInvalid={Boolean(fieldErrors.email)} 
                  value={form.email} 
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} 
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-secondary">Contraseña</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Mínimo 6 caracteres"
                  className="py-2"
                  isInvalid={Boolean(fieldErrors.password)} 
                  value={form.password} 
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} 
                />
                <Form.Control.Feedback type="invalid">{fieldErrors.password}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-semibold text-secondary">Tipo de Usuario (Rol)</Form.Label>
                <Form.Select 
                  className="py-2 form-select"
                  isInvalid={Boolean(fieldErrors.role)} 
                  value={form.role} 
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                >
                  <option value="follower">Seguidor</option>
                  <option value="creator">Creador</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{fieldErrors.role}</Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100 py-2 fw-semibold mb-3" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Registrarse'}
              </Button>
              <div className="text-center">
                <Form.Text className="text-muted">
                  ¿Ya tienes una cuenta? <Link to="/login" className="text-decoration-none fw-semibold">Inicia sesión</Link>
                </Form.Text>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default RegisterPage
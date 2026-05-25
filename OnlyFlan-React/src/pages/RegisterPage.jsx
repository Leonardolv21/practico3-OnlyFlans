import { useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { registerSchema } from '../validation/schemas.js'

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'follower' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setFieldErrors({})
    try {
      const cleanForm = await registerSchema.validate(form, { abortEarly: false })
      await register(cleanForm)
      setSuccess('Registro exitoso. Ahora inicia sesion.')
      setTimeout(() => navigate('/login'), 900)
    } catch (apiError) {
      if (apiError.name === 'ValidationError') {
        const nextErrors = {}
        apiError.inner.forEach((issue) => {
          if (issue.path && !nextErrors[issue.path]) nextErrors[issue.path] = issue.message
        })
        setFieldErrors(nextErrors)
        return
      }
      setError(apiError.response?.data?.message || 'No se pudo registrar')
    }
  }

  return (
    <Row className="justify-content-center">
      <Col md={7} lg={5}>
        <Card>
          <Card.Body>
            <Card.Title>Crear cuenta</Card.Title>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control isInvalid={Boolean(fieldErrors.name)} value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
                <Form.Control.Feedback type="invalid">{fieldErrors.name}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" isInvalid={Boolean(fieldErrors.email)} value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
                <Form.Control.Feedback type="invalid">{fieldErrors.email}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contrasena</Form.Label>
                <Form.Control type="password" minLength={6} isInvalid={Boolean(fieldErrors.password)} value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
                <Form.Control.Feedback type="invalid">{fieldErrors.password}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Rol</Form.Label>
                <Form.Select isInvalid={Boolean(fieldErrors.role)} value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}>
                  <option value="follower">Seguidor</option>
                  <option value="creator">Creador</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{fieldErrors.role}</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit">Registrar</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default RegisterPage

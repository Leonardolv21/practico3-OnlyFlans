import { useState } from 'react'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { loginSchema } from '../validation/schemas.js'

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    try {
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
      setError(apiError.response?.data?.message || 'No se pudo iniciar sesion')
    }
  }

  return (
    <Row className="justify-content-center">
      <Col md={6} lg={4}>
        <Card>
          <Card.Body>
            <Card.Title>Ingresar</Card.Title>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" isInvalid={Boolean(fieldErrors.email)} value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
                <Form.Control.Feedback type="invalid">{fieldErrors.email}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contrasena</Form.Label>
                <Form.Control type="password" isInvalid={Boolean(fieldErrors.password)} value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
                <Form.Control.Feedback type="invalid">{fieldErrors.password}</Form.Control.Feedback>
              </Form.Group>
              <Button type="submit">Entrar</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default LoginPage

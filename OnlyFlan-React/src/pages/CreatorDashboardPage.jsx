import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Form, ListGroup, Row } from 'react-bootstrap'
import apiClient from '../api/client.js'
import { createGoalSchema, createPostSchema } from '../validation/schemas.js'

function CreatorDashboardPage() {
  const [dashboard, setDashboard] = useState([])
  const [postForm, setPostForm] = useState({ text: '', image_url: '' })
  const [goalForm, setGoalForm] = useState({ title: '', description: '' })
  const [profileForm, setProfileForm] = useState({ profile_picture: null, banner: null })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [goalErrors, setGoalErrors] = useState({})
  const [postErrors, setPostErrors] = useState({})

  const loadDashboard = async () => {
    const response = await apiClient.get('/creators/me/dashboard')
    setDashboard(response.data)
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const createPost = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setPostErrors({})
    try {
      const cleanPost = await createPostSchema.validate(postForm, { abortEarly: false })
      await apiClient.post('/posts', cleanPost)
      setPostForm({ text: '', image_url: '' })
      setSuccess('Post creado')
      loadDashboard()
    } catch (apiError) {
      if (apiError.name === 'ValidationError') {
        const nextErrors = {}
        apiError.inner.forEach((issue) => {
          if (issue.path && !nextErrors[issue.path]) nextErrors[issue.path] = issue.message
        })
        if (!Object.keys(nextErrors).length) nextErrors.form = apiError.message
        setPostErrors(nextErrors)
        return
      }
      setError(apiError.response?.data?.message || 'No se pudo crear el post')
    }
  }

  const createGoal = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setGoalErrors({})
    try {
      const cleanGoal = await createGoalSchema.validate(goalForm, { abortEarly: false })
      await apiClient.post('/creators/me/goals', cleanGoal)
      setGoalForm({ title: '', description: '' })
      setSuccess('Meta creada')
    } catch (apiError) {
      if (apiError.name === 'ValidationError') {
        const nextErrors = {}
        apiError.inner.forEach((issue) => {
          if (issue.path && !nextErrors[issue.path]) nextErrors[issue.path] = issue.message
        })
        setGoalErrors(nextErrors)
        return
      }
      setError(apiError.response?.data?.message || 'No se pudo crear la meta')
    }
  }

  const updateProfile = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    const formData = new FormData()
    if (profileForm.profile_picture) formData.append('profile_picture', profileForm.profile_picture)
    if (profileForm.banner) formData.append('banner', profileForm.banner)
    try {
      await apiClient.put('/creators/me/profile', formData)
      setSuccess('Imagenes actualizadas')
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'No se pudo actualizar perfil')
    }
  }

  return (
    <>
      <h2 className="mb-3">Panel del creador</h2>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="g-3 mb-4">
        <Col lg={4}>
          <Card><Card.Body>
            <Card.Title>Subir perfil y banner</Card.Title>
            <Form onSubmit={updateProfile}>
              <Form.Group className="mb-2">
                <Form.Label>Foto de perfil</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={(e) => setProfileForm((prev) => ({ ...prev, profile_picture: e.target.files?.[0] || null }))} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Banner</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={(e) => setProfileForm((prev) => ({ ...prev, banner: e.target.files?.[0] || null }))} />
              </Form.Group>
              <Button type="submit">Guardar imagenes</Button>
            </Form>
          </Card.Body></Card>
        </Col>
        <Col lg={4}>
          <Card><Card.Body>
            <Card.Title>Nueva meta</Card.Title>
            <Form onSubmit={createGoal}>
              <Form.Control className="mb-2" isInvalid={Boolean(goalErrors.title)} placeholder="Titulo" value={goalForm.title} onChange={(e) => setGoalForm((prev) => ({ ...prev, title: e.target.value }))} />
              <Form.Control.Feedback type="invalid">{goalErrors.title}</Form.Control.Feedback>
              <Form.Control as="textarea" className="mb-2" isInvalid={Boolean(goalErrors.description)} placeholder="Descripcion" value={goalForm.description} onChange={(e) => setGoalForm((prev) => ({ ...prev, description: e.target.value }))} />
              <Form.Control.Feedback type="invalid">{goalErrors.description}</Form.Control.Feedback>
              <Button type="submit">Crear meta</Button>
            </Form>
          </Card.Body></Card>
        </Col>
        <Col lg={4}>
          <Card><Card.Body>
            <Card.Title>Nuevo post</Card.Title>
            <Form onSubmit={createPost}>
              <Form.Control className="mb-2" isInvalid={Boolean(postErrors.text)} placeholder="Texto" value={postForm.text} onChange={(e) => setPostForm((prev) => ({ ...prev, text: e.target.value }))} />
              <Form.Control.Feedback type="invalid">{postErrors.text}</Form.Control.Feedback>
              <Form.Control className="mb-2" isInvalid={Boolean(postErrors.image_url || postErrors.form)} placeholder="URL imagen (opcional)" value={postForm.image_url} onChange={(e) => setPostForm((prev) => ({ ...prev, image_url: e.target.value }))} />
              <Form.Control.Feedback type="invalid">{postErrors.image_url || postErrors.form}</Form.Control.Feedback>
              <Button type="submit">Publicar</Button>
            </Form>
          </Card.Body></Card>
        </Col>
      </Row>

      <h4>Publicaciones y comentarios</h4>
      <ListGroup>
        {dashboard.map((post) => (
          <ListGroup.Item key={post.id}>
            <strong>{post.text || '(sin texto)'}</strong>
            {post.comments?.length > 0 && (
              <ul className="mt-2 mb-0">
                {post.comments.map((comment) => (
                  <li key={comment.id}><b>{comment.follower?.name}:</b> {comment.text}</li>
                ))}
              </ul>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  )
}

export default CreatorDashboardPage

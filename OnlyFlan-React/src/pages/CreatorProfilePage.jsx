import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Form, ListGroup } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import apiClient from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'
import { donationSchema } from '../validation/schemas.js'

function CreatorProfilePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [flans, setFlans] = useState(1)
  const [commentByPost, setCommentByPost] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [donationError, setDonationError] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)

  const resolveImageUrl = (value) => {
    if (!value) return ''
    if (value.startsWith('http://') || value.startsWith('https://')) return value
    return `http://localhost:3000${value}`
  }

  const loadProfile = async () => {
    const response = await apiClient.get(`/creators/${id}/profile`)
    setProfile(response.data)
  }

  const loadFavoriteStatus = async () => {
    if (user?.role !== 'follower') return
    const response = await apiClient.get('/followers/favorites')
    const exists = response.data.some((item) => Number(item.creator_id) === Number(id))
    setIsFavorite(exists)
  }

  const loadPosts = async () => {
    setError('')
    try {
      const response = await apiClient.get(`/creators/${id}/posts`)
      setPosts(response.data)
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'No se pudieron cargar los posts')
    }
  }

  useEffect(() => {
    loadProfile()
  }, [id])

  useEffect(() => {
    loadFavoriteStatus()
  }, [id, user?.role])

  const donate = async () => {
    setMessage('')
    setError('')
    setDonationError('')
    try {
      const cleanDonation = await donationSchema.validate({ flans: Number(flans) }, { abortEarly: false })
      await apiClient.post('/donations', { creator_id: Number(id), flan_count: Number(cleanDonation.flans), support_type: 'flan' })
      setMessage('Donacion realizada')
      loadProfile()
    } catch (apiError) {
      if (apiError.name === 'ValidationError') {
        setDonationError(apiError.message)
        return
      }
      setError(apiError.response?.data?.message || 'No se pudo donar')
    }
  }

  const addComment = async (postId) => {
    setMessage('')
    setError('')
    try {
      await apiClient.post(`/posts/${postId}/comments`, { text: commentByPost[postId] || '' })
      setMessage('Comentario enviado')
      setCommentByPost((prev) => ({ ...prev, [postId]: '' }))
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'No se pudo comentar')
    }
  }

  const toggleFavorite = async () => {
    setMessage('')
    setError('')
    try {
      if (isFavorite) {
        await apiClient.delete(`/followers/favorites/${id}`)
        setIsFavorite(false)
        setMessage('Quitado de favoritos')
      } else {
        await apiClient.post(`/followers/favorites/${id}`)
        setIsFavorite(true)
        setMessage('Agregado a favoritos')
      }
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'No se pudo actualizar favoritos')
    }
  }

  const follow = async () => {
    await apiClient.post(`/followers/following/${id}`)
    setMessage('Ahora sigues a este creador')
  }

  if (!profile) return <p>Cargando perfil...</p>

  return (
    <div>
      <Card className="mb-3">
        {profile.creator.banner && (
          <Card.Img
            variant="top"
            src={resolveImageUrl(profile.creator.banner)}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
        <Card.Body>
          {profile.creator.profile_picture && (
            <img
              src={resolveImageUrl(profile.creator.profile_picture)}
              alt={profile.creator.name}
              width={84}
              height={84}
              className="rounded-circle mb-2"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}
          <h3>{profile.creator.name}</h3>
          {profile.active_goals?.map((goal) => (
            <Badge key={goal.id} bg="secondary" className="me-2">{goal.title}</Badge>
          ))}
        </Card.Body>
      </Card>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {user?.role === 'follower' && (
        <Card className="mb-3">
          <Card.Body className="d-flex flex-wrap gap-2 align-items-end">
            <Form.Group>
              <Form.Label>Flanes</Form.Label>
              <Form.Control type="number" min={1} isInvalid={Boolean(donationError)} value={flans} onChange={(e) => setFlans(e.target.value)} />
              <Form.Control.Feedback type="invalid">{donationError}</Form.Control.Feedback>
            </Form.Group>
            <Button onClick={donate}>Donar</Button>
            <Button variant={isFavorite ? 'outline-danger' : 'outline-primary'} onClick={toggleFavorite}>
              {isFavorite ? 'Quitar de favoritos' : 'Favorito'}
            </Button>
            <Button variant="outline-success" onClick={follow}>Seguir</Button>
            <Button variant="dark" onClick={loadPosts}>Ver publicaciones</Button>
          </Card.Body>
        </Card>
      )}

      <ListGroup>
        {posts.map((post) => (
          <ListGroup.Item key={post.id}>
            <p>{post.text || '(sin texto)'}</p>
            {post.image_url && <img src={resolveImageUrl(post.image_url)} alt="post" className="img-fluid rounded mb-2" />}            {user?.role === 'follower' && (
              <div className="d-flex gap-2">
                <Form.Control placeholder="Escribe un comentario" value={commentByPost[post.id] || ''} onChange={(e) => setCommentByPost((prev) => ({ ...prev, [post.id]: e.target.value }))} />
                <Button onClick={() => addComment(post.id)}>Comentar</Button>
              </div>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default CreatorProfilePage

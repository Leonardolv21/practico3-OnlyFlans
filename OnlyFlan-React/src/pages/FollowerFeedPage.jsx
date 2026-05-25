import { useEffect, useState } from 'react'
import { Alert, Card, ListGroup, Spinner } from 'react-bootstrap'
import apiClient from '../api/client.js'

function FollowerFeedPage() {
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const resolveImageUrl = (value) => {
    if (!value) return ''
    if (value.startsWith('http://') || value.startsWith('https://')) return value
    return `http://localhost:3000${value}`
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await apiClient.get('/followers/feed')
        setFeed(response.data)
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'No se pudo cargar el feed')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <Card>
      <Card.Body>
        <Card.Title>Feed de creadores seguidos</Card.Title>
        {loading && <Spinner animation="border" size="sm" className="mb-3" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && feed.length === 0 && (
          <Alert variant="info" className="mb-0">
            Aun no tienes publicaciones en tu feed. Dona a un creador para empezar a ver posts.
          </Alert>
        )}
        <ListGroup>
          {feed.map((post) => (
            <ListGroup.Item key={post.id}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <b>{post.creator?.name}</b>
                <small className="text-muted">{new Date(post.published_at).toLocaleString()}</small>
              </div>
              <p className="mb-2">{post.text || '(sin texto)'}</p>
              {post.image_url && (
                <img
                  src={resolveImageUrl(post.image_url)}
                  alt="post"
                  className="img-fluid rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

export default FollowerFeedPage

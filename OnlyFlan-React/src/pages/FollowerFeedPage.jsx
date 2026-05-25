import { useEffect, useState } from 'react'
import { Card, ListGroup, Alert } from 'react-bootstrap'
import apiClient from '../api/client.js'

function FollowerFeedPage() {
  const [feed, setFeed] = useState([])

  useEffect(() => {
    apiClient.get('/followers/feed')
      .then(res => setFeed(res.data))
      .catch(() => {})
  }, [])

  return (
    <div>
      <h2 className="mb-3">Tu Feed de Publicaciones</h2>
      {feed.length === 0 ? (
        <Alert variant="info">Aún no sigues a ningún creador o no hay publicaciones disponibles.</Alert>
      ) : (
        <ListGroup>
          {feed.map(post => (
            <ListGroup.Item key={post.id} className="mb-3 border rounded p-3">
              <div className="d-flex align-items-center mb-2">
                <strong>{post.creator?.name}</strong>
                <span className="text-muted ms-2" style={{ fontSize: '0.85rem' }}>
                  {new Date(post.published_at).toLocaleString()}
                </span>
              </div>
              <p>{post.text || '(Publicación sin texto)'}</p>
              {post.image_url && (
                <img 
                  src={post.image_url.startsWith('http') ? post.image_url : `http://localhost:3000${post.image_url}`} 
                  alt="Post" 
                  className="img-fluid rounded" 
                  style={{ maxHeight: '400px' }}
                />
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  )
}
export default FollowerFeedPage
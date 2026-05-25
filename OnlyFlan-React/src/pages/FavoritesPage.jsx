import { useEffect, useState } from 'react'
import { Card, Col, Row, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import apiClient from '../api/client.js'

function FavoritesPage() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    apiClient.get('/followers/favorites')
      .then(res => setFavorites(res.data))
      .catch(() => {})
  }, [])

  return (
    <div>
      <h2 className="mb-3">Mis Creadores Favoritos</h2>
      {favorites.length === 0 ? (
        <Alert variant="info">No tienes creadores agregados a tus favoritos todavía.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-3">
          {favorites.map(item => (
            <Col key={item.creator_id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{item.creator?.name}</Card.Title>
                  <Button as={Link} to={`/creators/${item.creator_id}/profile`} variant="primary">
                    Ir al Perfil
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
export default FavoritesPage
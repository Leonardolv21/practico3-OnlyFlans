import { useEffect, useState } from 'react'
import { Card, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import apiClient from '../api/client.js'

function FavoritesPage() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const load = async () => {
      const response = await apiClient.get('/followers/favorites')
      setFavorites(response.data)
    }
    load()
  }, [])

  return (
    <Card>
      <Card.Body>
        <Card.Title>Mis favoritos</Card.Title>
        <ListGroup>
          {favorites.map((item) => (
            <ListGroup.Item key={`${item.follower_id}-${item.creator_id}`}>
              <Link to={`/creators/${item.creator.id}/profile`}>{item.creator.name}</Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

export default FavoritesPage

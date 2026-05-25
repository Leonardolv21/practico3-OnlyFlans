import { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import apiClient from '../api/client.js'

function CreatorSearchPage() {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState([])

  const search = async (text = '') => {
    const response = await apiClient.get('/creators/search', { params: { q: text } })
    setItems(response.data)
  }

  useEffect(() => {
    search('')
  }, [])

  return (
    <>
      <h2 className="mb-3">Buscar creadores</h2>
      <Form className="d-flex gap-2 mb-4" onSubmit={(e) => { e.preventDefault(); search(query) }}>
        <Form.Control placeholder="Nombre del creador" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button type="submit">Buscar</Button>
      </Form>
      <Row xs={1} md={2} lg={3} className="g-3">
        {items.map((creator) => (
          <Col key={creator.id}>
            <Card className="h-100">
              {creator.banner && <Card.Img variant="top" src={`http://localhost:3000${creator.banner}`} onError={(e) => { e.currentTarget.style.display = 'none' }} />}
              <Card.Body>
                <Card.Title>{creator.name}</Card.Title>
                <Button as={Link} to={`/creators/${creator.id}/profile`}>Ver perfil</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default CreatorSearchPage

import { useEffect, useState } from 'react'
import { Card, Col, Row, Container, ListGroup, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import apiClient from '../api/client.js'

function CreatorsListPage() {
  const [creators, setCreators] = useState([])

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await apiClient.get('/creators/search', { params: { q: '' } })
        // Ordenamiento Alfabético requerido por el práctico
        const sorted = response.data.sort((a, b) => a.name.localeCompare(b.name))
        setCreators(sorted)
      } catch (error) {
        console.error('Error al cargar la lista alfabética')
      }
    }
    fetchCreators()
  }, [])

  return (
    <Container>
      <div className="mb-4">
        <h2 className="fw-bold text-dark m-0">Directorio de Creadores</h2>
        <p className="text-muted">Lista oficial ordenada alfabéticamente para cumplir con los requerimientos del práctico.</p>
      </div>
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <ListGroup variant="flush">
            {creators.length === 0 ? (
              <ListGroup.Item className="text-center py-4 text-muted">No hay creadores registrados en el sistema.</ListGroup.Item>
            ) : (
              creators.map((creator) => (
                <ListGroup.Item key={creator.id} className="d-flex justify-content-between align-items-center p-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="fw-semibold text-dark fs-5">{creator.name}</div>
                  </div>
                  <Button as={Link} to={`/creators/${creator.id}/profile`} variant="outline-primary" size="sm" className="fw-semibold">
                    Visitar Perfil →
                  </Button>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default CreatorsListPage
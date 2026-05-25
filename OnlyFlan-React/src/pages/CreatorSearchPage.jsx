import { useEffect, useState } from 'react'
import { Button, Form, ListGroup } from 'react-bootstrap'
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
      <h2 className="mb-3">Creadores</h2>
      <Form className="d-flex gap-2 mb-4" onSubmit={(e) => { e.preventDefault(); search(query) }}>
        <Form.Control placeholder="Nombre del creador" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button type="submit">Buscar</Button>
      </Form>
      <ListGroup>
        {items.map((creator) => (
          <ListGroup.Item key={creator.id} className="d-flex justify-content-between align-items-center">
            <span>{creator.name}</span>
            <Button as={Link} to={`/creators/${creator.id}/profile`} size="sm">Ver perfil</Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  )
}

export default CreatorSearchPage

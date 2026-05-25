import { useState } from 'react'
import { Button, Card, Form, Table } from 'react-bootstrap'
import apiClient from '../api/client.js'

function DonationHistoryPage() {
  const [filters, setFilters] = useState({ startDate: '', endDate: '', creatorName: '' })
  const [items, setItems] = useState([])

  const loadHistory = async (event) => {
    event.preventDefault()
    const response = await apiClient.get('/donations/history', { params: filters })
    setItems(response.data)
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Historial de donaciones</Card.Title>
        <Form className="d-flex gap-2 mb-3" onSubmit={loadHistory}>
          <Form.Control type="date" value={filters.startDate} onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))} />
          <Form.Control type="date" value={filters.endDate} onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))} />
          <Form.Control placeholder="Nombre del creador" value={filters.creatorName} onChange={(e) => setFilters((prev) => ({ ...prev, creatorName: e.target.value }))} />
          <Button type="submit">Filtrar</Button>
        </Form>
        <Table striped>
          <thead><tr><th>Fecha</th><th>Creador</th><th>Flanes</th><th>Tipo</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.donated_at).toLocaleString()}</td>
                <td>{item.creator?.name}</td>
                <td>{item.flan_count}</td>
                <td>{item.support_type}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}

export default DonationHistoryPage

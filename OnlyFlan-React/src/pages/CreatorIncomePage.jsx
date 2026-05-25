import { useState } from 'react'
import { Button, Card, Form, Table } from 'react-bootstrap'
import apiClient from '../api/client.js'

function CreatorIncomePage() {
  const [filters, setFilters] = useState({ startDate: '', endDate: '' })
  const [report, setReport] = useState({ history: [], total_flans: 0 })

  const loadReport = async (event) => {
    event.preventDefault()
    const response = await apiClient.get('/creators/me/income', { params: filters })
    setReport(response.data)
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Reporte de ingresos</Card.Title>
        <Form className="d-flex gap-2 mb-3" onSubmit={loadReport}>
          <Form.Control type="date" value={filters.startDate} onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))} />
          <Form.Control type="date" value={filters.endDate} onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))} />
          <Button type="submit">Filtrar</Button>
        </Form>
        <h5>Total flanes: {report.total_flans}</h5>
        <Table striped>
          <thead><tr><th>Fecha</th><th>Seguidor</th><th>Flanes</th><th>Tipo</th></tr></thead>
          <tbody>
            {report.history.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.donated_at).toLocaleString()}</td>
                <td>{item.follower?.name}</td>
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

export default CreatorIncomePage

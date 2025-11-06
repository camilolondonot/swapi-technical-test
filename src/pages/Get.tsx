import { Layout } from '@components'
import { useQuery } from '@tanstack/react-query'
import { getPeople } from '@/services/Api'
import { Container } from '@ui'

const Get = () => {
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['people'],
    queryFn: () => getPeople(),
  })

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error al cargar</p>
  if (!data) return <p>No hay datos disponibles</p>

  return (
    <Layout>
      <Container>
        <h1>Personajes</h1>
        <div>{data.results.map((person: any) => (
          <div key={person.id}>{person.name}</div>
        ))}</div>
      </Container>
    </Layout>
  )
};

export default Get
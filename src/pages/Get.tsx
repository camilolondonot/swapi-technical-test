import { useEffect } from 'react'
import { Layout } from '@components'
import { useQuery } from '@tanstack/react-query'
import { getAllCollections } from '@/services/Api'
import { Carousel } from '@components/Carousel'
import { PackCard } from '@cards'
import { Button } from '@ui'
import { Link } from 'react-router-dom'
import type { Person, Film, Starship } from '@/types/api'
import { useAlbum } from '@/store/useAlbum'

const Get = () => {
  const initializeSpecialAssignments = useAlbum((state) => state.initializeSpecialAssignments)

  const { data, isLoading } = useQuery<{
    people: Person[]
    films: Film[]
    starships: Starship[]
    counts: { people: number; films: number; starships: number }
  }>({
    queryKey: ['collections'],
    queryFn: () => getAllCollections(),
  })

  useEffect(() => {
    if (!data) return

    initializeSpecialAssignments('people', data.people)
    initializeSpecialAssignments('films', data.films)
    initializeSpecialAssignments('starships', data.starships)
  }, [data, initializeSpecialAssignments])

  if (isLoading) {
    return (
      <Layout>
        <div className="w-full min-h-screen flex flex-col items-center justify-center py-20">
          <div className="text-center space-y-6">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-lg text-base-content/70">Cargando la galaxia...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!data) {
    return (
      <Layout>
        <div className="w-full min-h-screen flex flex-col items-center justify-center py-20">
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-3xl font-bold">No hay datos disponibles</h2>
            <p className="text-base-content/70">Intenta recargar la página</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Recargar
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  const people = data.people as Person[]
  const films = data.films as Film[]
  const starships = data.starships as Starship[]

  // Preparar items para carruseles
  const peopleItems = people.map((person) => ({
    id: person.url,
    name: person.name,
    type: 'person' as const,
    data: person,
  }))

  const filmsItems = films.map((film) => ({
    id: film.url,
    name: film.title,
    type: 'film' as const,
    data: film,
  }))

  const starshipsItems = starships.map((starship) => ({
    id: starship.url,
    name: starship.name,
    type: 'starship' as const,
    data: starship,
  }))

  const totalCount = (data.counts.people || 0) + (data.counts.films || 0) + (data.counts.starships || 0)

  return (
    <Layout>
      <div className="w-full">
        {/* Hero Header */}
        <div className="w-full bg-linear-to-r from-primary/10 via-secondary/10 to-accent/10 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-4 text-sm text-base-content/60 animate-fade-in-up">
              <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
              <span>/</span>
              <span className="text-base-content">Obtener Cartas</span>
            </div>
            
            <div className="space-y-4 animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-extrabold">
                <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Obtener Cartas
                </span>
              </h1>
              <p className="text-xl text-base-content/70 max-w-2xl">
                Explora y colecciona cartas de personajes, películas y naves. ¡Completa tu álbum!
              </p>
              
              {/* Estadísticas rápidas */}
              <div className="flex flex-wrap gap-4 mt-6 animate-fade-in-up delay-200">
                <div className="badge badge-lg badge-primary gap-2">
                  <span>{data.counts.people || 0}</span>
                  <span>Personajes</span>
                </div>
                <div className="badge badge-lg badge-secondary gap-2">
                  <span>{data.counts.films || 0}</span>
                  <span>Películas</span>
                </div>
                <div className="badge badge-lg badge-accent gap-2">
                  <span>{data.counts.starships || 0}</span>
                  <span>Naves</span>
                </div>
                <div className="badge badge-lg badge-neutral gap-2">
                  <span>{totalCount}</span>
                  <span>Total</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sobres */}
        <section className="w-full py-16 bg-base-200/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in-up delay-300">
              <h2 className="text-4xl font-bold mb-3">📦 Sobres Disponibles</h2>
              <p className="text-lg text-base-content/70">
                Abre sobres misteriosos y descubre cartas especiales
              </p>
            </div>
            <div className="flex justify-center gap-6 flex-wrap">
              {[1, 2, 3, 4].map((packNumber) => (
                <PackCard
                  key={packNumber}
                  packNumber={packNumber}
                  collections={{
                    people: data.people,
                    films: data.films,
                    starships: data.starships,
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Personajes */}
        <section className="w-full py-20 relative">
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent -z-10" />
          <div className="mb-12 text-center animate-fade-in-up delay-300">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-5xl">👤</span>
              <h2 className="text-4xl md:text-5xl font-bold">Personajes</h2>
            </div>
            <p className="text-lg text-base-content/70">
              Descubre los personajes más icónicos de la galaxia
            </p>
            <div className="mt-4 text-sm text-base-content/60">
              {data.counts.people || 0} personajes disponibles
            </div>
          </div>
          <Carousel items={peopleItems} speed={35} />
        </section>

        {/* Películas */}
        <section className="w-full py-20 bg-base-200/10 relative">
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-secondary/5 to-transparent -z-10" />
          <div className="mb-12 text-center animate-fade-in-up delay-300">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-5xl">🎬</span>
              <h2 className="text-4xl md:text-5xl font-bold">Películas</h2>
            </div>
            <p className="text-lg text-base-content/70">
              Colecciona todas las películas de la saga
            </p>
            <div className="mt-4 text-sm text-base-content/60">
              {data.counts.films || 0} películas disponibles
            </div>
          </div>
          <Carousel items={filmsItems} speed={30} />
        </section>

        {/* Naves */}
        <section className="w-full py-20 relative">
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-accent/5 to-transparent -z-10" />
          <div className="mb-12 text-center animate-fade-in-up delay-300">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-5xl">🚀</span>
              <h2 className="text-4xl md:text-5xl font-bold">Naves Espaciales</h2>
            </div>
            <p className="text-lg text-base-content/70">
              Las naves más poderosas de la galaxia
            </p>
            <div className="mt-4 text-sm text-base-content/60">
              {data.counts.starships || 0} naves disponibles
            </div>
          </div>
          <Carousel items={starshipsItems} speed={35} />
        </section>

        {/* CTA Final */}
        <section className="w-full py-16 bg-linear-to-r from-primary/10 to-secondary/10">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6 animate-fade-in-up delay-300">
            <h2 className="text-3xl font-bold">¿Listo para ver tu colección?</h2>
            <p className="text-lg text-base-content/70">
              Revisa tu álbum y ve qué cartas has coleccionado
            </p>
            <Button variant="primary" to="/album" className="btn-lg">
              Ver Mi Álbum
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  )
};

export default Get
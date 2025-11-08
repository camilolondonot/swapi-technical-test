import { Layout } from '@components'
import { useAlbum } from '@/store/useAlbum'
import { Button } from '@ui'
import { Link } from 'react-router-dom'
import { PersonCard, FilmCard, StarshipCard } from '@cards'
import { ALBUM_DEFINITIONS } from '@constants/album'
import type { Sticker } from '@/types/album'
import type { Person, Film, Starship } from '@/types/api'

const Album = () => {
  const { films, people, starships, resetAlbum, getSpecialClass } = useAlbum()

  // Calcular estadísticas
  const countStickers = (section: Record<number, Sticker | null>) => {
    return Object.values(section).filter(Boolean).length
  }

  const totalFilms = countStickers(films)
  const totalPeople = countStickers(people)
  const totalStarships = countStickers(starships)
  const totalStickers = totalFilms + totalPeople + totalStarships

  const maxFilms = ALBUM_DEFINITIONS.films.total
  const maxPeople = ALBUM_DEFINITIONS.people.total
  const maxStarships = ALBUM_DEFINITIONS.starships.total
  const maxTotal = maxFilms + maxPeople + maxStarships

  const filmsPercentage = Math.round((totalFilms / maxFilms) * 100)
  const peoplePercentage = Math.round((totalPeople / maxPeople) * 100)
  const starshipsPercentage = Math.round((totalStarships / maxStarships) * 100)
  const totalPercentage = Math.round((totalStickers / maxTotal) * 100)

  const collectStickers = (section: Record<number, Sticker | null>) =>
    Object.values(section).filter((value): value is Sticker => value !== null)

  const peopleCards = collectStickers(people)
  const filmsCards = collectStickers(films)
  const starshipsCards = collectStickers(starships)

  const toPerson = (sticker: Sticker): Person => ({
    name: sticker.name,
    height: 'unknown',
    mass: 'unknown',
    gender: 'unknown',
    hair_color: 'unknown',
    skin_color: 'unknown',
    eye_color: 'unknown',
    birth_year: 'unknown',
    url: sticker.url,
    homeworld: '',
    films: [],
    species: [],
    vehicles: [],
    starships: [],
    created: '',
    edited: '',
  })

  const toFilm = (sticker: Sticker): Film => ({
    title: sticker.name,
    episode_id: sticker.id,
    opening_crawl: '',
    director: 'unknown',
    producer: 'unknown',
    release_date: '',
    characters: [],
    planets: [],
    starships: [],
    vehicles: [],
    species: [],
    created: '',
    edited: '',
    url: sticker.url,
  })

  const toStarship = (sticker: Sticker): Starship => ({
    name: sticker.name,
    model: 'unknown',
    manufacturer: 'unknown',
    cost_in_credits: 'unknown',
    length: 'unknown',
    max_atmosphering_speed: 'unknown',
    crew: 'unknown',
    passengers: 'unknown',
    cargo_capacity: 'unknown',
    consumables: 'unknown',
    hyperdrive_rating: 'unknown',
    MGLT: 'unknown',
    starship_class: 'unknown',
    pilots: [],
    films: [],
    created: '',
    edited: '',
    url: sticker.url,
  })

  const hasStickers = totalStickers > 0

  return (
    <Layout>
      <div className="w-full">
        {/* Hero Header */}
        <div className="w-full bg-linear-to-r from-primary/10 via-secondary/10 to-accent/10 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-4 text-sm text-base-content/60 animate-fade-in-up">
              <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
              <span>/</span>
              <span className="text-base-content">Mi Álbum</span>
            </div>
            
            <div className="space-y-6 animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-extrabold">
                <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Mi Álbum
                </span>
              </h1>
              
              {/* Progreso general */}
              <div className="card bg-base-100/80 backdrop-blur-sm shadow-lg border border-base-300 animate-fade-in-up delay-200">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold">Progreso Total</span>
                    <span className="text-2xl font-bold text-primary">{totalPercentage}%</span>
                  </div>
                  <progress 
                    className="progress progress-primary w-full" 
                    value={totalStickers} 
                    max={maxTotal}
                  />
                  <div className="flex justify-between text-sm text-base-content/70 mt-2">
                    <span>{totalStickers} de {maxTotal} cartas</span>
                    <span>{maxTotal - totalStickers} faltantes</span>
                  </div>
                </div>
              </div>

              {/* Estadísticas por categoría */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up delay-300">
                <div className="card bg-base-100/80 backdrop-blur-sm shadow-lg border border-base-300">
                  <div className="card-body items-center text-center py-4">
                    <div className="text-4xl mb-2">👤</div>
                    <div className="stat-value text-2xl font-bold text-primary">{totalPeople}</div>
                    <div className="stat-desc text-base-content/70">{peoplePercentage}% completado</div>
                    <progress className="progress progress-primary w-full mt-2" value={totalPeople} max={maxPeople} />
                  </div>
                </div>
                
                <div className="card bg-base-100/80 backdrop-blur-sm shadow-lg border border-base-300">
                  <div className="card-body items-center text-center py-4">
                    <div className="text-4xl mb-2">🎬</div>
                    <div className="stat-value text-2xl font-bold text-secondary">{totalFilms}</div>
                    <div className="stat-desc text-base-content/70">{filmsPercentage}% completado</div>
                    <progress className="progress progress-secondary w-full mt-2" value={totalFilms} max={maxFilms} />
                  </div>
                </div>
                
                <div className="card bg-base-100/80 backdrop-blur-sm shadow-lg border border-base-300">
                  <div className="card-body items-center text-center py-4">
                    <div className="text-4xl mb-2">🚀</div>
                    <div className="stat-value text-2xl font-bold text-accent">{totalStarships}</div>
                    <div className="stat-desc text-base-content/70">{starshipsPercentage}% completado</div>
                    <progress className="progress progress-accent w-full mt-2" value={totalStarships} max={maxStarships} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!hasStickers ? (
          /* Estado vacío */
          <div className="w-full py-20">
            <div className="max-w-2xl mx-auto px-4 text-center space-y-8 animate-fade-in-up">
              <div className="text-8xl mb-4 animate-fade-in-up">📚</div>
              <h2 className="text-4xl font-bold animate-fade-in-up delay-200">Tu álbum está vacío</h2>
              <p className="text-xl text-base-content/70 animate-fade-in-up delay-200">
                Comienza a coleccionar cartas visitando la sección "Obtener Cartas"
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in-up delay-300">
                <Button variant="primary" to="/get" className="btn-lg">
                  <span className="text-2xl mr-2">📦</span>
                  Obtener Cartas
                </Button>
                <Button variant="secondary" to="/" className="btn-lg">
                  Volver al Inicio
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-16 py-12">
            {/* Personajes */}
            {peopleCards.length > 0 && (
              <section className="w-full">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="mb-8 animate-fade-in-up delay-300">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-4xl font-bold mb-2">👤 Personajes</h2>
                        <p className="text-base-content/70">
                          {totalPeople} de {maxPeople} personajes ({peoplePercentage}%)
                        </p>
                      </div>
                    </div>
                    <progress 
                      className="progress progress-primary w-full" 
                      value={totalPeople} 
                      max={maxPeople}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {peopleCards.map((sticker) => (
                      <PersonCard
                        key={sticker.id}
                        person={toPerson(sticker)}
                        specialClass={sticker.specialClass ?? getSpecialClass('people', sticker.id)}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Películas */}
            {filmsCards.length > 0 && (
              <section className="w-full bg-base-200/10">
                <div className="max-w-7xl mx-auto px-4 py-12">
                  <div className="mb-8 animate-fade-in-up delay-300">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-4xl font-bold mb-2">🎬 Películas</h2>
                        <p className="text-base-content/70">
                          {totalFilms} de {maxFilms} películas ({filmsPercentage}%)
                        </p>
                      </div>
                    </div>
                    <progress 
                      className="progress progress-secondary w-full" 
                      value={totalFilms} 
                      max={maxFilms}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filmsCards.map((sticker) => (
                      <FilmCard
                        key={sticker.id}
                        film={toFilm(sticker)}
                        specialClass={sticker.specialClass ?? getSpecialClass('films', sticker.id)}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Naves */}
            {starshipsCards.length > 0 && (
              <section className="w-full">
                <div className="max-w-7xl mx-auto px-4 py-12">
                  <div className="mb-8 animate-fade-in-up delay-300">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-4xl font-bold mb-2">🚀 Naves Espaciales</h2>
                        <p className="text-base-content/70">
                          {totalStarships} de {maxStarships} naves ({starshipsPercentage}%)
                        </p>
                      </div>
                    </div>
                    <progress 
                      className="progress progress-accent w-full" 
                      value={totalStarships} 
                      max={maxStarships}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {starshipsCards.map((sticker) => (
                      <StarshipCard
                        key={sticker.id}
                        starship={toStarship(sticker)}
                        specialClass={sticker.specialClass ?? getSpecialClass('starships', sticker.id)}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Acciones */}
            <section className="w-full py-12 bg-base-200/20">
              <div className="max-w-4xl mx-auto px-4 text-center space-y-6 animate-fade-in-up delay-300">
                <h2 className="text-3xl font-bold">Gestiona tu colección</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="primary" to="/get" className="btn-lg">
                    Obtener Más Cartas
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      if (confirm('¿Estás seguro de que quieres borrar toda tu colección?')) {
                        resetAlbum()
                      }
                    }}
                    className="btn-lg"
                  >
                    Reiniciar Álbum
                  </Button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </Layout>
  )
};

export default Album
import { Layout } from '@components'
import { Button } from '@ui'
import { useQuery } from '@tanstack/react-query'
import { getPeople, getFilms, getStarships } from '@/services/Api'

const Home = () => {
  const { data: peopleData } = useQuery({
    queryKey: ['people'],
    queryFn: () => getPeople(),
  })

  const { data: filmsData } = useQuery({
    queryKey: ['films'],
    queryFn: () => getFilms(),
  })

  const { data: starshipsData } = useQuery({
    queryKey: ['starships'],
    queryFn: () => getStarships(),
  })

  const totalPeople = peopleData?.count || 0
  const totalFilms = filmsData?.count || 0
  const totalStarships = starshipsData?.count || 0

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative w-full min-h-screen flex flex-col">
        {/* Background con gradiente */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-base-100 to-secondary/10 -z-10" />
        
        {/* Contenido principal */}
        <div className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-4xl w-full text-center space-y-12">
            {/* Título y descripción */}
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h1 className="text-7xl md:text-8xl font-extrabold bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  SWX Album
                </h1>
                <p className="text-3xl md:text-4xl font-semibold text-base-content/80">
                  Colecciona la Galaxia
                </p>
              </div>
              
              <p className="text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
                Descubre, colecciona y organiza personajes icónicos, películas épicas y naves espaciales 
                de la saga más legendaria del universo. ¡Crea tu propio álbum de Star Wars!
              </p>
            </div>

            {/* CTAs principales */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
              <Button 
                variant="primary" 
                to="/get" 
                className="btn-lg min-w-[200px] text-lg px-8 py-4 h-auto transform hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
              >
                <span className="text-2xl mr-2">📦</span>
                Obtener Cartas
              </Button>
              <Button 
                variant="secondary" 
                to="/album" 
                className="btn-lg min-w-[200px] text-lg px-8 py-4 h-auto transform hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
              >
                <span className="text-2xl mr-2">📚</span>
                Mi Álbum
              </Button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in-up delay-200">
              <div className="card bg-base-100/80 backdrop-blur-sm shadow-lg border border-base-300">
                <div className="card-body items-center text-center py-6">
                  <div className="text-4xl mb-2">👤</div>
                  <div className="stat-value text-3xl font-bold text-primary">{totalPeople}</div>
                  <div className="stat-desc text-base-content/70">Personajes</div>
                </div>
              </div>
              
              <div className="card bg-base-100/80 backdrop-blur-sm shadow-lg border border-base-300">
                <div className="card-body items-center text-center py-6">
                  <div className="text-4xl mb-2">🎬</div>
                  <div className="stat-value text-3xl font-bold text-secondary">{totalFilms}</div>
                  <div className="stat-desc text-base-content/70">Películas</div>
                </div>
              </div>
              
              <div className="card bg-base-100/80 backdrop-blur-sm shadow-lg border border-base-300">
                <div className="card-body items-center text-center py-6">
                  <div className="text-4xl mb-2">🚀</div>
                  <div className="stat-value text-3xl font-bold text-accent">{totalStarships}</div>
                  <div className="stat-desc text-base-content/70">Naves</div>
                </div>
              </div>
            </div>

            {/* Features destacadas */}
            <div className="mt-20 space-y-4 animate-fade-in-up delay-300">
              <h2 className="text-2xl font-bold text-base-content/80 mb-6">¿Por qué coleccionar?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="flex gap-3 p-4 rounded-lg bg-base-100/60 backdrop-blur-sm border border-base-300">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <h3 className="font-semibold mb-1">Cartas Especiales</h3>
                    <p className="text-sm text-base-content/70">Obtén ediciones doradas y limitadas</p>
                  </div>
                </div>
                <div className="flex gap-3 p-4 rounded-lg bg-base-100/60 backdrop-blur-sm border border-base-300">
                  <span className="text-2xl">📦</span>
                  <div>
                    <h3 className="font-semibold mb-1">Sobres Misteriosos</h3>
                    <p className="text-sm text-base-content/70">Abre sobres y descubre qué hay dentro</p>
                  </div>
                </div>
                <div className="flex gap-3 p-4 rounded-lg bg-base-100/60 backdrop-blur-sm border border-base-300">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h3 className="font-semibold mb-1">Completa tu Álbum</h3>
                    <p className="text-sm text-base-content/70">Organiza tu colección personal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
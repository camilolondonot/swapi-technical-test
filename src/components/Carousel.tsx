import { useEffect, useRef } from 'react'
import type { Person, Film, Starship } from '@/types/api'

interface CarouselItem {
  id: string
  name: string
  type: 'person' | 'film' | 'starship'
  data: Person | Film | Starship
}

interface CarouselProps {
  items: CarouselItem[]
  speed?: number // velocidad en segundos
}

export const Carousel = ({ items, speed = 30 }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const uniqueId = useRef(`carousel-${Math.random().toString(36).substring(2, 11)}`)

  useEffect(() => {
    if (items.length === 0) return

    // Configurar animación CSS con ID único
    const styleId = `carousel-style-${uniqueId.current}`
    let style = document.getElementById(styleId) as HTMLStyleElement

    if (!style) {
      style = document.createElement('style')
      style.id = styleId
      document.head.appendChild(style)
    }

    const itemWidth = 344 // w-80 (320px) + gap-6 (24px) = 344px
    const totalWidth = items.length * itemWidth
    const animationDuration = speed

    style.textContent = `
      #${uniqueId.current} .carousel-inner {
        animation: scroll-${uniqueId.current} ${animationDuration}s linear infinite;
      }
      #${uniqueId.current} .carousel-inner:hover {
        animation-play-state: paused;
      }
      @keyframes scroll-${uniqueId.current} {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-${totalWidth}px);
        }
      }
    `

    return () => {
      if (style && style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [items, speed])

  const getIcon = (type: string) => {
    switch (type) {
      case 'person':
        return '👤'
      case 'film':
        return '🎬'
      case 'starship':
        return '🚀'
      default:
        return '⭐'
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'person':
        return 'badge-primary'
      case 'film':
        return 'badge-secondary'
      case 'starship':
        return 'badge-accent'
      default:
        return 'badge-neutral'
    }
  }

  if (items.length === 0) {
    return null
  }

  // Duplicar items para efecto infinito
  const duplicatedItems = [...items, ...items]

  return (
    <div id={uniqueId.current} className="w-full overflow-hidden">
      <div className="relative">
        <div ref={carouselRef} className="flex carousel-inner gap-6 px-4">
          {duplicatedItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="shrink-0 w-80"
            >
              <div className="card bg-base-100 shadow-xl h-full border border-base-300 hover:shadow-2xl transition-shadow">
                <div className="card-body p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-5xl">{getIcon(item.type)}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="card-title text-xl truncate mb-2">{item.name}</h3>
                      <span className={`badge badge-lg ${getTypeBadge(item.type)}`}>
                        {item.type === 'person' ? 'Personaje' : item.type === 'film' ? 'Película' : 'Nave'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-base-content/70 space-y-2 mt-2">
                    {item.type === 'person' && (
                      <>
                        <p><strong>Altura:</strong> {(item.data as Person).height} cm</p>
                        <p><strong>Género:</strong> {(item.data as Person).gender}</p>
                      </>
                    )}
                    {item.type === 'film' && (
                      <>
                        <p><strong>Episodio:</strong> {(item.data as Film).episode_id}</p>
                        <p><strong>Director:</strong> {(item.data as Film).director}</p>
                        <p><strong>Año:</strong> {new Date((item.data as Film).release_date).getFullYear()}</p>
                      </>
                    )}
                    {item.type === 'starship' && (
                      <>
                        <p><strong>Modelo:</strong> {(item.data as Starship).model}</p>
                        <p><strong>Clase:</strong> {(item.data as Starship).starship_class}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gradientes para efecto de desvanecimiento */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-base-200/50 dark:from-base-300/50 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-base-200/50 dark:from-base-300/50 to-transparent pointer-events-none z-10" />
      </div>
    </div>
  )
}


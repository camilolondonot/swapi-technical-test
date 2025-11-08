import { useState, useEffect, useMemo } from 'react'
import type { Person, Film, Starship, SpecialClass } from '@/types/api'
import { Modal } from '@ui'
import { Button } from '@ui'
import { useAlbum } from '@/store/useAlbum'
import { useNotifications } from '@/store/useNotifications'
import { PersonCard, FilmCard, StarshipCard } from './index'

const PACK_COST = 25

interface PackContent {
  people?: Person[]
  films?: Film[]
  starships?: Starship[]
}

interface PackCardProps {
  packNumber: number
  content: PackContent
}

export const PackCard = ({ packNumber, content }: PackCardProps) => {
  const modalId = `pack-modal-${packNumber}`
  const revealModalId = `pack-reveal-${packNumber}`
  const points = useAlbum((state) => state.points)
  const buyPack = useAlbum((state) => state.buyPack)
  const addNotification = useNotifications((state) => state.addNotification)
  const [isRevealed, setIsRevealed] = useState(false)

  const totalItems = 
    (content.people?.length || 0) + 
    (content.films?.length || 0) + 
    (content.starships?.length || 0)

  const peopleCount = content.people?.length || 0
  const filmsCount = content.films?.length || 0
  const starshipsCount = content.starships?.length || 0

  const canBuy = points >= PACK_COST

  const handleBuy = () => {
    if (buyPack()) {
      setIsRevealed(true)
      const infoModal = document.getElementById(modalId) as HTMLDialogElement
      infoModal?.close()
      setTimeout(() => {
        const revealModal = document.getElementById(revealModalId) as HTMLDialogElement
        revealModal?.showModal()
      }, 100)
    } else {
      addNotification('No tienes suficientes puntos para comprar este sobre.', 'error')
    }
  }

  return (
    <>
      <div
        className="card bg-linear-to-br from-primary to-primary-focus shadow-lg cursor-pointer hover:shadow-xl transition-all transform hover:scale-105 text-primary-content"
        onClick={() => {
          const modal = document.getElementById(modalId) as HTMLDialogElement
          modal?.showModal()
        }}
      >
        <div className="card-body p-6 text-center">
          <div className="text-4xl mb-2">📦</div>
          <h3 className="card-title text-xl justify-center">Sobre #{packNumber}</h3>
          <p className="opacity-90">
            {totalItems} {totalItems === 1 ? 'carta' : 'cartas'}
          </p>
          <div className="mt-2 text-sm opacity-80">
            {peopleCount > 0 && (
              <span className="mr-2">👤 {peopleCount}</span>
            )}
            {filmsCount > 0 && (
              <span className="mr-2">🎬 {filmsCount}</span>
            )}
            {starshipsCount > 0 && (
              <span>🚀 {starshipsCount}</span>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-primary-content/20">
            <div className="badge badge-lg badge-warning">
              💰 {PACK_COST} puntos
            </div>
          </div>
        </div>
      </div>

      {/* Modal de información */}
      <Modal id={modalId} title={`Sobre #${packNumber}`} size="lg">
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🔒</div>
            <p className="text-lg text-base-content/70">
              El contenido de este sobre es secreto. Solo se revelará al comprarlo.
            </p>
          </div>

          <div className="card bg-base-200/50 border-2 border-dashed border-base-300">
            <div className="card-body">
              <h3 className="card-title justify-center mb-4">Contenido del Sobre</h3>
              
              <div className="space-y-4">
                {peopleCount > 0 && (
                  <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">👤</span>
                      <span className="font-semibold">Personajes</span>
                    </div>
                    <span className="badge badge-lg badge-primary">
                      {peopleCount} {peopleCount === 1 ? 'personaje' : 'personajes'}
                    </span>
                  </div>
                )}

                {filmsCount > 0 && (
                  <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🎬</span>
                      <span className="font-semibold">Películas</span>
                    </div>
                    <span className="badge badge-lg badge-secondary">
                      {filmsCount} {filmsCount === 1 ? 'película' : 'películas'}
                    </span>
                  </div>
                )}

                {starshipsCount > 0 && (
                  <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🚀</span>
                      <span className="font-semibold">Naves</span>
                    </div>
                    <span className="badge badge-lg badge-accent">
                      {starshipsCount} {starshipsCount === 1 ? 'nave' : 'naves'}
                    </span>
                  </div>
                )}

                {totalItems === 0 && (
                  <div className="text-center p-4 text-base-content/70">
                    Este sobre está vacío
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-base-content/70 mb-2">Costo: <span className="font-bold text-primary">{PACK_COST} puntos</span></p>
              <p className="text-sm text-base-content/70">Tus puntos: <span className="font-bold">{points}</span></p>
            </div>
            <Button
              variant="primary"
              onClick={handleBuy}
              disabled={!canBuy}
              className="btn-lg w-full"
            >
              {canBuy ? `💰 Comprar por ${PACK_COST} puntos` : '❌ Puntos insuficientes'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de revelación */}
      {isRevealed && (
        <PackRevealModal
          packId={revealModalId}
          packContent={content}
          onClose={() => setIsRevealed(false)}
        />
      )}
    </>
  )
}

// Componente separado para el modal de revelación
interface PackRevealModalProps {
  packId: string
  packContent: PackContent
  onClose: () => void
}

const PackRevealModal = ({ packId, packContent, onClose }: PackRevealModalProps) => {
  const [showCards, setShowCards] = useState(false)
  const [processed, setProcessed] = useState<Record<string, boolean>>({})

  const addSticker = useAlbum((state) => state.addSticker)
  const getSpecialClass = useAlbum((state) => state.getSpecialClass)
  const isStickerCollected = useAlbum((state) => state.isStickerCollected)
  const addNotification = useNotifications((state) => state.addNotification)

  const packItems = useMemo(() => {
    const items: Array<{
      item: Person | Film | Starship
      type: 'people' | 'films' | 'starships'
      id: number
      name: string
      specialClass: SpecialClass | null
    }> = []

    const pushItems = <T extends Person | Film | Starship>(
      list: T[] | undefined,
      type: 'people' | 'films' | 'starships',
    ) => {
      list?.forEach((entry) => {
        const parts = entry.url.split('/').filter(Boolean)
        const parsedId = parts.length ? parseInt(parts.pop() ?? '0', 10) : 0
        if (!parsedId) return

        const label = 'name' in entry ? entry.name : entry.title
        items.push({
          item: entry,
          type,
          id: parsedId,
          name: label,
          specialClass: getSpecialClass(type, parsedId),
        })
      })
    }

    pushItems(packContent.people, 'people')
    pushItems(packContent.films, 'films')
    pushItems(packContent.starships, 'starships')

    return items
  }, [getSpecialClass, packContent.films, packContent.people, packContent.starships])

  useEffect(() => {
    setProcessed({})
    setShowCards(false)
  }, [packId])

  useEffect(() => {
    const modal = document.getElementById(packId) as HTMLDialogElement | null
    if (!modal) return

    const openTimer = setTimeout(() => {
      modal.showModal()
      const revealTimer = setTimeout(() => setShowCards(true), 1200)
      modal.dataset.revealTimer = String(revealTimer)
    }, 100)

    modal.dataset.openTimer = String(openTimer)

    const handleClose = () => {
      const storedReveal = modal.dataset.revealTimer
      if (storedReveal) {
        clearTimeout(Number(storedReveal))
      }
      setShowCards(false)
      setProcessed({})
      onClose()
    }

    modal.addEventListener('close', handleClose)

    return () => {
      clearTimeout(openTimer)
      const storedReveal = modal?.dataset.revealTimer
      if (storedReveal) {
        clearTimeout(Number(storedReveal))
      }
      modal?.removeEventListener('close', handleClose)
    }
  }, [onClose, packId])

  useEffect(() => {
    if (!showCards || packItems.length === 0) return

    const allProcessed = packItems.every(({ type, id }) => {
      const key = `${type}-${id}`
      return processed[key] || isStickerCollected(type, id)
    })

    if (allProcessed) {
      const modal = document.getElementById(packId) as HTMLDialogElement | null
      setTimeout(() => modal?.close(), 500)
    }
  }, [isStickerCollected, packId, packItems, processed, showCards])

  const markProcessed = (key: string) => {
    setProcessed((prev) => ({
      ...prev,
      [key]: true,
    }))
  }

  const handleAddToAlbum = (item: Person | Film | Starship, type: 'people' | 'films' | 'starships', id: number, name: string, specialClass: SpecialClass | null) => {
    const added = addSticker({
      id,
      section: type,
      name,
      url: item.url,
      specialClass,
    })

    if (added) {
      addNotification(`"${name}" agregado a tu álbum.`, 'success')
    } else {
      addNotification(`"${name}" ya estaba en tu álbum.`, 'warning')
    }

    markProcessed(`${type}-${id}`)
  }

  const handleDiscard = (type: 'people' | 'films' | 'starships', id: number, name: string) => {
    addNotification(`"${name}" descartado.`, 'info')
    markProcessed(`${type}-${id}`)
  }

  return (
    <Modal id={packId} title="" size="5xl">
      <div className="space-y-6">
        {!showCards ? (
          <div className="text-center py-12 space-y-6">
            <div className="text-8xl animate-bounce">📦</div>
            <div className="text-4xl font-bold animate-pulse">✨ Abriendo sobre... ✨</div>
            <div className="flex justify-center gap-2">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-fade-in-up">🎉</div>
              <h2 className="text-3xl font-bold mb-2">¡Contenido Revelado!</h2>
              <p className="text-base-content/70">Decide qué hacer con cada carta</p>
            </div>

            {packItems.map(({ item, type, id, name, specialClass }, index) => {
              const key = `${type}-${id}`
              const alreadyCollected = isStickerCollected(type, id)
              const isDisabled = processed[key] || alreadyCollected

              return (
                <div
                  key={`${item.url}-${index}`}
                  className="card bg-base-100 shadow-xl border-2 border-base-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-body">
                    <div className="mb-4">
                      {type === 'people' && (
                        <PersonCard
                          person={item as Person}
                          specialClass={specialClass}
                        />
                      )}
                      {type === 'films' && (
                        <FilmCard
                          film={item as Film}
                          specialClass={specialClass}
                        />
                      )}
                      {type === 'starships' && (
                        <StarshipCard
                          starship={item as Starship}
                          specialClass={specialClass}
                        />
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        variant="primary"
                        onClick={() => handleAddToAlbum(item, type, id, name, specialClass)}
                        className="btn-lg"
                        disabled={isDisabled}
                      >
                        {alreadyCollected ? '✅ Ya en tu álbum' : '✅ Agregar al Álbum'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleDiscard(type, id, name)}
                        className="btn-lg"
                        disabled={processed[key]}
                      >
                        ❌ Descartar
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Modal>
  )
}



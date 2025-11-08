import { useState, useEffect, useMemo } from 'react'
import type { Person, Film, Starship, SpecialClass } from '@/types/api'
import { Modal } from '@ui'
import { Button } from '@ui'
import { useAlbum } from '@/store/useAlbum'
import { useNotifications } from '@/store/useNotifications'
import {
  usePacks,
  usePackCooldownSeconds,
  isPackLocked,
  formatCooldown,
  type PackId,
} from '@/store/usePacks'
import { fetchResourceByUrl } from '@/services/Api'
import { PersonCard, FilmCard, StarshipCard } from './index'

const PACK_COST = 25

interface PackContent {
  people: Person[]
  films: Film[]
  starships: Starship[]
}

type SectionCounts = {
  people: number
  films: number
  starships: number
}

interface PackConfiguration {
  id: 'A' | 'B'
  label: string
  counts: SectionCounts
}

const PACK_CONFIGURATIONS: PackConfiguration[] = [
  {
    id: 'A',
    label: '1 Película · 3 Personajes · 1 Nave',
    counts: { films: 1, people: 3, starships: 1 },
  },
  {
    id: 'B',
    label: '0 Películas · 3 Personajes · 2 Naves',
    counts: { films: 0, people: 3, starships: 2 },
  },
];

interface PackCardProps {
  packNumber: number
  collections: {
    people: Person[]
    films: Film[]
    starships: Starship[]
  }
}

const SECTION_LABELS: Record<'people' | 'films' | 'starships', string> = {
  people: 'Personajes',
  films: 'Películas',
  starships: 'Naves',
}

const selectRandomItems = <T extends { url: string }>(items: T[], count: number, usedUrls: Set<string>) => {
  if (count === 0) return []

  const available = items.filter((item) => !usedUrls.has(item.url))
  if (available.length < count) return null

  const selection: T[] = []
  const pool = [...available]

  while (selection.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length)
    const [chosen] = pool.splice(index, 1)
    selection.push(chosen)
    usedUrls.add(chosen.url)
  }

  return selection.length === count ? selection : null
}

const generatePackContent = (
  configuration: PackConfiguration,
  collections: { people: Person[]; films: Film[]; starships: Starship[] },
): PackContent | null => {
  const usedUrls = new Set<string>()
  const films = selectRandomItems(collections.films, configuration.counts.films, usedUrls)
  if (films === null) return null

  const people = selectRandomItems(collections.people, configuration.counts.people, usedUrls)
  if (people === null) return null

  const starships = selectRandomItems(collections.starships, configuration.counts.starships, usedUrls)
  if (starships === null) return null

  return {
    films,
    people,
    starships,
  }
}

export const PackCard = ({ packNumber, collections }: PackCardProps) => {
  const modalId = `pack-modal-${packNumber}`
  const revealModalId = `pack-reveal-${packNumber}`
  const points = useAlbum((state) => state.points)
  const buyPack = useAlbum((state) => state.buyPack)
  const addNotification = useNotifications((state) => state.addNotification)
  const activePackId = usePacks((state) => state.activePackId)
  const openPack = usePacks((state) => state.openPack)
  const finishPack = usePacks((state) => state.finishPack)
  const cooldownSeconds = usePackCooldownSeconds()
  const [isRevealed, setIsRevealed] = useState(false)
  const [currentPackContent, setCurrentPackContent] = useState<PackContent | null>(null)
  const [currentConfiguration, setCurrentConfiguration] = useState<PackConfiguration | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingContent, setIsLoadingContent] = useState(false)

  const packId = packNumber as PackId
  const isCurrentActive = activePackId === packId
  const lockedByCooldown = isPackLocked(packId, activePackId, cooldownSeconds)
  const anotherPackActive = activePackId !== null && !isCurrentActive
  const isProcessingCurrent = isCurrentActive && isRevealed
  const canBuy = points >= PACK_COST
  const disablePurchase =
    !canBuy || lockedByCooldown || anotherPackActive || isProcessingCurrent || isGenerating
  const showCooldownBadge = !isCurrentActive && cooldownSeconds > 0

  const totalItemsLabel = '5 cartas'

  const fetchPackContent = async (content: PackContent): Promise<PackContent> => {
    const fetchSection = async <T extends { url: string }>(items: T[]): Promise<T[]> =>
      Promise.all(
        items.map(async (item) => {
          const data = await fetchResourceByUrl<T>(item.url)
          return data
        })
      )

    const [people, films, starships] = await Promise.all([
      fetchSection<Person>(content.people),
      fetchSection<Film>(content.films),
      fetchSection<Starship>(content.starships),
    ])

    return { people, films, starships }
  }

  const handleBuy = async () => {
    if (lockedByCooldown) {
      addNotification(`Este sobre estará disponible en ${formatCooldown(cooldownSeconds)}.`, 'warning')
      return
    }

    if (anotherPackActive) {
      addNotification(`Ya estás abriendo el sobre #${activePackId}.`, 'warning')
      return
    }

    if (!canBuy) {
      addNotification('No tienes suficientes puntos para comprar este sobre.', 'error')
      return
    }

    setIsGenerating(true)

    const opened = openPack(packId)
    if (!opened) {
      setIsGenerating(false)
      addNotification('Debes esperar a que termine el temporizador antes de abrir otro sobre.', 'warning')
      return
    }

    const configuration = PACK_CONFIGURATIONS[Math.floor(Math.random() * PACK_CONFIGURATIONS.length)]
    const selection = generatePackContent(configuration, collections)

    if (!selection) {
      finishPack()
      setIsGenerating(false)
      addNotification('No hay suficientes cartas para generar este sobre. Intenta más tarde.', 'error')
      return
    }

    try {
      setCurrentConfiguration(configuration)
      setCurrentPackContent(selection)
      setIsRevealed(true)
      setIsLoadingContent(true)

      const infoModal = document.getElementById(modalId) as HTMLDialogElement
      infoModal?.close()

      setTimeout(() => {
        const revealModal = document.getElementById(revealModalId) as HTMLDialogElement
        revealModal?.showModal()
      }, 100)

      const fetchedContent = await fetchPackContent(selection)

      const purchased = buyPack()
      if (!purchased) {
        finishPack()
        setIsRevealed(false)
        setCurrentConfiguration(null)
        const revealModal = document.getElementById(revealModalId) as HTMLDialogElement
        revealModal?.close()
        addNotification('No tienes suficientes puntos para comprar este sobre.', 'error')
        return
      }

      setCurrentPackContent(fetchedContent)
      addNotification(`📦 Sobre #${packNumber} comprado por ${PACK_COST} puntos.`, 'success')
    } catch {
      finishPack()
      setIsRevealed(false)
      setCurrentConfiguration(null)
      setCurrentPackContent(null)
      const revealModal = document.getElementById(revealModalId) as HTMLDialogElement
      revealModal?.close()
      addNotification('No se pudo obtener el contenido del sobre. Intenta de nuevo.', 'error')
    } finally {
      setIsGenerating(false)
      setIsLoadingContent(false)
    }
  }

  const handleRevealClose = () => {
    setIsRevealed(false)
    setCurrentPackContent(null)
    setCurrentConfiguration(null)
    finishPack()
  }

  const isCardDisabled = lockedByCooldown || anotherPackActive || isGenerating || isProcessingCurrent

  return (
    <>
      <div
        className={`relative card bg-linear-to-br from-primary to-primary-focus shadow-lg transition-all text-primary-content ${
          isCardDisabled
            ? 'opacity-60 cursor-not-allowed'
            : 'cursor-pointer hover:shadow-xl transform hover:scale-105'
        }`}
        onClick={() => {
          if (isCardDisabled) return
          const modal = document.getElementById(modalId) as HTMLDialogElement
          modal?.showModal()
        }}
      >
        {showCooldownBadge && (
          <div className="badge badge-warning absolute right-4 top-4 gap-2">
            <span>⏳</span>
            <span>{formatCooldown(cooldownSeconds)}</span>
          </div>
        )}
        {isCurrentActive && (
          <div className="badge badge-success absolute right-4 top-4 gap-2">
            <span>🔥</span>
            <span>En proceso</span>
          </div>
        )}
        <div className="card-body p-6 text-center">
          <div className="text-4xl mb-2">📦</div>
          <h3 className="card-title text-xl justify-center">Sobre #{packNumber}</h3>
          <p className="opacity-90">{totalItemsLabel}</p>
          <div className="mt-2 text-sm opacity-80 space-y-1">
            {PACK_CONFIGURATIONS.map((config) => (
              <div key={config.id}>
                <span className="badge badge-ghost mr-2">Config {config.id}</span>
                {config.label}
              </div>
            ))}
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

          {(lockedByCooldown || anotherPackActive) && (
            <div className="alert alert-warning">
              <span>
                {anotherPackActive
                  ? `Termina primero el Sobre #${activePackId} para abrir otro.`
                  : `Este sobre estará disponible en ${formatCooldown(cooldownSeconds)}.`}
              </span>
            </div>
          )}

          <div className="card bg-base-200/50 border-2 border-dashed border-base-300">
            <div className="card-body">
              <h3 className="card-title justify-center mb-4">Contenido del Sobre</h3>
              <div className="space-y-4">
                <div className="p-4 bg-base-100 rounded-lg border border-base-200">
                  <p className="font-semibold mb-2">Configuraciones posibles:</p>
                  <ul className="space-y-1 text-sm text-base-content/70">
                    {PACK_CONFIGURATIONS.map((config) => (
                      <li key={config.id}>
                        <span className="badge badge-outline mr-2">{config.id}</span>
                        {config.label}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-base-100 rounded-lg border border-base-200 text-sm text-base-content/70">
                  Cada sobre contiene exactamente 5 cartas. Su combinación se revelará al abrirlo.
                </div>
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
              disabled={disablePurchase}
              className="btn-lg w-full"
            >
              {isGenerating
                ? '🔄 Consultando API...'
                : disablePurchase
                  ? !canBuy
                    ? '❌ Puntos insuficientes'
                    : isProcessingCurrent
                      ? '✨ Sobre en proceso'
                      : '⏳ Disponible pronto'
                  : `💰 Comprar por ${PACK_COST} puntos`}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de revelación */}
      {isRevealed && (
        <PackRevealModal
          packId={revealModalId}
          packContent={currentPackContent}
          configuration={currentConfiguration}
          isLoading={isLoadingContent}
          onClose={handleRevealClose}
        />
      )}
    </>
  )
}

// Componente separado para el modal de revelación
interface PackRevealModalProps {
  packId: string
  packContent: PackContent | null
  configuration: PackConfiguration | null
  isLoading: boolean
  onClose: () => void
}

const PackRevealModal = ({ packId, packContent, configuration, isLoading, onClose }: PackRevealModalProps) => {
  const [showCards, setShowCards] = useState(false)
  const [processed, setProcessed] = useState<Record<string, 'added' | 'discarded'>>({})

  const addSticker = useAlbum((state) => state.addSticker)
  const getSpecialClass = useAlbum((state) => state.getSpecialClass)
  const isStickerCollected = useAlbum((state) => state.isStickerCollected)
  const addNotification = useNotifications((state) => state.addNotification)

  const packItems = useMemo(() => {
    if (!packContent) return []

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
  }, [getSpecialClass, packContent])

  useEffect(() => {
    if (!packContent) {
      setProcessed({})
    }
    setShowCards(false)
  }, [packId, packContent])

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
    if (!showCards || isLoading || packItems.length === 0) return

    const allProcessed = packItems.every(({ type, id }) => {
      const key = `${type}-${id}`
      return processed[key] !== undefined
    })

    if (allProcessed) {
      const modal = document.getElementById(packId) as HTMLDialogElement | null
      setTimeout(() => modal?.close(), 500)
    }
  }, [isLoading, packId, packItems, processed, showCards])

  useEffect(() => {
    if (!showCards || packItems.length === 0) return

    setProcessed((prev) => {
      const next = { ...prev }
      packItems.forEach(({ type, id }) => {
        const key = `${type}-${id}`
        if (isStickerCollected(type, id)) {
          next[key] = 'added'
        }
      })
      return next
    })
  }, [isStickerCollected, packItems, showCards])

  const markProcessed = (key: string, action: 'added' | 'discarded') => {
    setProcessed((prev) => ({
      ...prev,
      [key]: action,
    }))
  }

  const handleAddToAlbum = (
    item: Person | Film | Starship,
    type: 'people' | 'films' | 'starships',
    id: number,
    name: string,
    specialClass: SpecialClass | null,
  ) => {
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

    markProcessed(`${type}-${id}`, 'added')
  }

  const handleDiscard = (type: 'people' | 'films' | 'starships', id: number, name: string) => {
    addNotification(`"${name}" descartado.`, 'info')
    markProcessed(`${type}-${id}`, 'discarded')
  }

  return (
    <Modal id={packId} title="" size="5xl">
      <div className="space-y-6">
        {!showCards || packItems.length === 0 ? (
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
              {configuration && (
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-base-content/60">
                  <span className="badge badge-outline">Config {configuration.id}</span>
                  {configuration.label}
                </p>
              )}
              {isLoading && (
                <div className="mt-3 flex items-center justify-center gap-2 text-sm text-warning">
                  <span className="loading loading-spinner loading-xs"></span>
                  <span>Actualizando datos desde la API…</span>
                </div>
              )}
            </div>

            {packItems.map(({ item, type, id, name, specialClass }, index) => {
              const key = `${type}-${id}`
              const alreadyCollected = isStickerCollected(type, id)
              const processedState = processed[key]
              const isFinalized = processedState !== undefined
              const canAdd = !alreadyCollected && !isFinalized
              const canDiscard = !isFinalized && !alreadyCollected
              const specialBadgeClass = specialClass
                ? specialClass === 'gold'
                  ? 'badge-warning'
                  : 'badge-secondary'
                : 'badge-ghost'
              const specialBadgeLabel = specialClass
                ? specialClass === 'gold'
                  ? 'Especial · Dorada'
                  : 'Especial · Limitada'
                : 'Regular'

              return (
                <div
                  key={`${item.url}-${index}`}
                  className="card bg-base-100 shadow-xl border-2 border-base-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-body">
                    <div className="flex flex-wrap gap-2 text-sm text-base-content/70 mb-3">
                      <span className="badge badge-ghost">#{id}</span>
                      <span className="badge badge-outline">{SECTION_LABELS[type]}</span>
                      <span className={`badge ${specialBadgeClass}`}>{specialBadgeLabel}</span>
                    </div>
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
                        variant={alreadyCollected ? 'secondary' : 'primary'}
                        onClick={() => handleAddToAlbum(item, type, id, name, specialClass)}
                        className="btn-lg"
                        disabled={!canAdd}
                      >
                        {alreadyCollected
                          ? '✅ Ya en tu álbum'
                          : processedState === 'added'
                            ? '✅ Agregada'
                            : '✅ Agregar al Álbum'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleDiscard(type, id, name)}
                        className="btn-lg"
                        disabled={!canDiscard}
                      >
                        {processedState === 'discarded' ? '🗑️ Descartada' : '❌ Descartar'}
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



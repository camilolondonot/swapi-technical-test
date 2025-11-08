import type { Starship } from '@/types/api'
import { getSpecialClassNames } from '@/utils/specialClass'
import { Modal } from '@ui'

interface StarshipCardProps {
  starship: Starship
  specialClass?: 'gold' | 'limited' | null
}

export const StarshipCard = ({ starship, specialClass }: StarshipCardProps) => {
  const specialClasses = getSpecialClassNames(specialClass || null)
  const modalId = `starship-modal-${starship.url.split('/').filter(Boolean).pop()}`

  return (
    <>
      <div
        className={`card bg-base-100 shadow-md cursor-pointer hover:shadow-xl transition-shadow ${specialClasses}`}
        onClick={() => {
          const modal = document.getElementById(modalId) as HTMLDialogElement
          modal?.showModal()
        }}
      >
        <div className="card-body p-4">
          <div className="flex items-center justify-between">
            <h3 className="card-title text-lg">{starship.name}</h3>
            {specialClass && (
              <span className={`badge ${specialClass === 'gold' ? 'badge-warning' : 'badge-secondary'}`}>
                {specialClass === 'gold' ? '⭐ Dorada' : '✨ Limitada'}
              </span>
            )}
          </div>
          <div className="text-sm text-base-content/70 space-y-1">
            <p><strong>Modelo:</strong> {starship.model}</p>
            <p><strong>Clase:</strong> {starship.starship_class}</p>
            <p><strong>Manufacturador:</strong> {starship.manufacturer}</p>
          </div>
        </div>
      </div>

      <Modal id={modalId} title={starship.name} size="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-base-content/70"><strong>Modelo:</strong></p>
              <p>{starship.model}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70"><strong>Clase:</strong></p>
              <p>{starship.starship_class}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70"><strong>Manufacturador:</strong></p>
              <p>{starship.manufacturer}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70"><strong>Costo:</strong></p>
              <p>{starship.cost_in_credits === 'unknown' ? 'Desconocido' : `${starship.cost_in_credits} créditos`}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70"><strong>Longitud:</strong></p>
              <p>{starship.length} m</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70"><strong>Tripulación:</strong></p>
              <p>{starship.crew}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70"><strong>Pasajeros:</strong></p>
              <p>{starship.passengers}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70"><strong>Velocidad máxima:</strong></p>
              <p>{starship.max_atmosphering_speed}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70"><strong>Calificación de hiperimpulsor:</strong></p>
              <p>{starship.hyperdrive_rating}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70"><strong>Capacidad de carga:</strong></p>
              <p>{starship.cargo_capacity}</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}


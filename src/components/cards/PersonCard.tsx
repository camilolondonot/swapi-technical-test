import type { Person } from '@/types/api'
import { getSpecialClassNames } from '@/utils/specialClass'
import { Modal } from '@ui'

interface PersonCardProps {
  person: Person
  specialClass?: 'gold' | 'limited' | null
}

export const PersonCard = ({ person, specialClass }: PersonCardProps) => {
  const specialClasses = getSpecialClassNames(specialClass || null)
  
  // Extraer ID único para el modal
  const modalId = `person-modal-${person.url.split('/').filter(Boolean).pop()}`

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
            <h3 className="card-title text-lg">{person.name}</h3>
            {specialClass && (
              <span className={`badge ${specialClass === 'gold' ? 'badge-warning' : 'badge-secondary'}`}>
                {specialClass === 'gold' ? '⭐ Dorada' : '✨ Limitada'}
              </span>
            )}
          </div>
          <div className="text-sm text-base-content/70 space-y-1">
            <p><strong>Altura:</strong> {person.height} cm</p>
            <p><strong>Peso:</strong> {person.mass} kg</p>
            <p><strong>Género:</strong> {person.gender}</p>
          </div>
        </div>
      </div>

      <Modal id={modalId} title={person.name}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-base-content/70"><strong>Altura:</strong></p>
              <p>{person.height} cm</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70"><strong>Peso:</strong></p>
              <p>{person.mass} kg</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70"><strong>Color de pelo:</strong></p>
              <p>{person.hair_color}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70"><strong>Color de piel:</strong></p>
              <p>{person.skin_color}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70"><strong>Color de ojos:</strong></p>
              <p>{person.eye_color}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70"><strong>Año de nacimiento:</strong></p>
              <p>{person.birth_year}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70"><strong>Género:</strong></p>
              <p>{person.gender}</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}


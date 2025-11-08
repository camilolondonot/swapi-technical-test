import type { Film } from '@/types/api'
import { getSpecialClassNames } from '@/utils/specialClass'
import { Modal } from '@ui'

interface FilmCardProps {
  film: Film
  specialClass?: 'gold' | 'limited' | null
}

export const FilmCard = ({ film, specialClass }: FilmCardProps) => {
  const specialClasses = getSpecialClassNames(specialClass || null)
  const modalId = `film-modal-${film.url.split('/').filter(Boolean).pop()}`

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
            <h3 className="card-title text-lg">{film.title}</h3>
            {specialClass && (
              <span className={`badge ${specialClass === 'gold' ? 'badge-warning' : 'badge-secondary'}`}>
                {specialClass === 'gold' ? '⭐ Dorada' : '✨ Limitada'}
              </span>
            )}
          </div>
          <div className="text-sm text-base-content/70 space-y-1">
            <p><strong>Episodio:</strong> {film.episode_id}</p>
            <p><strong>Director:</strong> {film.director}</p>
            <p><strong>Fecha:</strong> {new Date(film.release_date).getFullYear()}</p>
          </div>
        </div>
      </div>

      <Modal id={modalId} title={film.title} size="2xl">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-base-content/70 mb-2"><strong>Episodio:</strong></p>
            <p>Episodio {film.episode_id}</p>
          </div>
          <div>
            <p className="text-sm text-base-content/70 mb-2"><strong>Director:</strong></p>
            <p>{film.director}</p>
          </div>
          <div>
            <p className="text-sm text-base-content/70 mb-2"><strong>Productor:</strong></p>
            <p>{film.producer}</p>
          </div>
          <div>
            <p className="text-sm text-base-content/70 mb-2"><strong>Fecha de lanzamiento:</strong></p>
            <p>{new Date(film.release_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-base-content/70 mb-2"><strong>Opening Crawl:</strong></p>
            <p className="text-sm italic">{film.opening_crawl}</p>
          </div>
        </div>
      </Modal>
    </>
  )
}


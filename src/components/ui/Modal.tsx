interface ModalProps {
  id: string
  title?: string
  children: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
}

const sizeClasses: Record<string, string> = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  full: 'max-w-full'
}

export const Modal = ({ id, title, children, size = 'lg' }: ModalProps) => {
  const sizeClass = sizeClasses[size] || sizeClasses.lg

  return (
    <dialog id={id} className="modal">
      <div className={`modal-box ${sizeClass}`}>
        {title && (
          <h3 className="font-bold text-lg mb-4">{title}</h3>
        )}
        {children}
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Cerrar</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}


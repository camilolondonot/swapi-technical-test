import { Link } from 'react-router-dom'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'link'
  to?: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  to, 
  onClick, 
  className = '',
  type = 'button'
}: ButtonProps) => {
  const baseClasses = 'btn'
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    link: 'btn-link'
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim()

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button 
      type={type}
      className={classes}
      onClick={onClick}
    >
      {children}
    </button>
  )
}


import type { ContainerProps } from '@/types/album'

const Container = ({ children }: ContainerProps) => {
  return (
    <div className="container mx-auto px-4">
      {children}
    </div>
  )
}

export default Container
export type Section = 'films' | 'people' | 'starships'

export interface Sticker {
  id: number
  section: Section
  name: string
  image?: string
}

export interface AlbumState {
  films: Record<number, Sticker | null>
  people: Record<number, Sticker | null>
  starships: Record<number, Sticker | null>
}

export interface ContainerProps {
  children: React.ReactNode
}
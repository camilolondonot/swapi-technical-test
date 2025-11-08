import type { SpecialClass } from '@/types/api'

export type Section = 'films' | 'people' | 'starships'

export interface Sticker {
  id: number
  section: Section
  name: string
  image?: string
  url: string // URL de la API para identificar
  specialClass: SpecialClass | null
}

export interface SpecialAssignments {
  films: Record<number, SpecialClass | null | undefined>
  people: Record<number, SpecialClass | null | undefined>
  starships: Record<number, SpecialClass | null | undefined>
}

export interface AlbumState {
  films: Record<number, Sticker | null>
  people: Record<number, Sticker | null>
  starships: Record<number, Sticker | null>
  points: number
  specialAssignments: SpecialAssignments
}

export interface ContainerProps {
  children: React.ReactNode
}
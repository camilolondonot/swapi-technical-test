import type { Section, SpecialAssignments } from '@/types/album'
import type { SpecialClass } from '@/types/api'

export interface AlbumSectionDefinition {
  key: Section
  label: string
  total: number
  specialIds: number[]
}

const range = (count: number) => Array.from({ length: count }, (_, index) => index + 1)

export const ALBUM_DEFINITIONS: Record<Section, AlbumSectionDefinition> = {
  films: {
    key: 'films',
    label: 'Películas',
    total: 6,
    specialIds: range(6),
  },
  people: {
    key: 'people',
    label: 'Personajes',
    total: 82,
    specialIds: range(20),
  },
  starships: {
    key: 'starships',
    label: 'Naves',
    total: 36,
    specialIds: range(10),
  },
}

export const SECTION_ORDER: Section[] = ['films', 'people', 'starships']

export const isDefaultSpecial = (section: Section, id: number) =>
  ALBUM_DEFINITIONS[section].specialIds.includes(id)

export const createEmptyAlbumSlots = () => {
  const createSectionSlots = (total: number) =>
    Object.fromEntries(range(total).map((value) => [value, null]))

  return {
    films: createSectionSlots(ALBUM_DEFINITIONS.films.total),
    people: createSectionSlots(ALBUM_DEFINITIONS.people.total),
    starships: createSectionSlots(ALBUM_DEFINITIONS.starships.total),
  }
}

const specialForDefault = (section: Section, id: number): SpecialClass | null =>
  isDefaultSpecial(section, id) ? 'gold' : null

export const createInitialSpecialAssignments = (): SpecialAssignments => {
  const assignments: SpecialAssignments = {
    films: {},
    people: {},
    starships: {},
  }

  SECTION_ORDER.forEach((section) => {
    const definition = ALBUM_DEFINITIONS[section]
    definition.specialIds.forEach((id) => {
      assignments[section][id] = specialForDefault(section, id)
    })
    // Asegurar que todas las posiciones tengan al menos null
    range(definition.total).forEach((id) => {
      if (!(id in assignments[section])) {
        assignments[section][id] = null
      }
    })
  })

  return assignments
}

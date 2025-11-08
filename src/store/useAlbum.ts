import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AlbumState, Sticker, Section } from '@/types/album'
import type { Person, Film, Starship, SpecialClass } from '@/types/api'
import { getRandomSpecialClass } from '@/utils/specialClass'

const PACK_COST = 25
const INITIAL_POINTS = 1000

const extractIdFromUrl = (url: string): number => {
  const parts = url.split('/').filter(Boolean)
  const id = parts.pop()
  return id ? parseInt(id, 10) : 0
}

const createEmptyAssignments = () => ({
  films: {} as Record<number, SpecialClass | null | undefined>,
  people: {} as Record<number, SpecialClass | null | undefined>,
  starships: {} as Record<number, SpecialClass | null | undefined>,
})

const initialAlbum = (): AlbumState => ({
  films: Object.fromEntries(Array.from({ length: 6 }, (_, i) => [i + 1, null])),
  people: Object.fromEntries(Array.from({ length: 82 }, (_, i) => [i + 1, null])),
  starships: Object.fromEntries(Array.from({ length: 36 }, (_, i) => [i + 1, null])),
  points: INITIAL_POINTS,
  specialAssignments: createEmptyAssignments(),
})

type AssignableItem = Person | Film | Starship

interface AlbumActions {
  addSticker: (sticker: Sticker) => boolean // retorna true si se agregó, false si es duplicado
  resetAlbum: () => void
  buyPack: () => boolean // retorna true si se pudo comprar
  getPoints: () => number
  initializeSpecialAssignments: (section: Section, items: AssignableItem[]) => void
  getSpecialClass: (section: Section, id: number) => SpecialClass | null
  isStickerCollected: (section: Section, id: number) => boolean
}

export const useAlbum = create(
  persist<AlbumState & AlbumActions>(
    (set, get) => {
      // El estado inicial siempre tiene 1000 puntos
      // Zustand persist manejará la carga desde localStorage
      const initialState = initialAlbum()

      return {
        ...initialState,

        getPoints: () => get().points,

        buyPack: () => {
          const state = get()
          if (state.points >= PACK_COST) {
            set({ points: state.points - PACK_COST })
            return true
          }
          return false
        },

        addSticker: (sticker: Sticker) => {
          const state = get()
          const sectionKey = sticker.section
          const section = { ...state[sectionKey] } as Record<number, Sticker | null>

          // Verificar duplicado
          if (section[sticker.id]) {
            return false // Es duplicado
          }

          const specialAssignments = state.specialAssignments[sectionKey]
          const assignedSpecialClass = sticker.specialClass ?? specialAssignments[sticker.id] ?? null

          section[sticker.id] = {
            ...sticker,
            specialClass: assignedSpecialClass,
          }

          set({
            ...state,
            [sectionKey]: section,
          })

          return true // Se agregó correctamente
        },

        resetAlbum: () => {
          const newState = initialAlbum()
          set(newState)
        },

        initializeSpecialAssignments: (section, items) => {
          set((state) => {
            const assignments = {
              ...state.specialAssignments,
              [section]: { ...state.specialAssignments[section] },
            }

            let hasChanges = false

            items.forEach((item) => {
              const id = extractIdFromUrl(item.url)
              if (!id) return

              if (assignments[section][id] === undefined) {
                assignments[section][id] = getRandomSpecialClass()
                hasChanges = true
              }
            })

            if (!hasChanges) {
              return state
            }

            return {
              ...state,
              specialAssignments: assignments,
            }
          })
        },

        getSpecialClass: (section, id) => {
          const { specialAssignments } = get()
          const value = specialAssignments[section][id]
          return value ?? null
        },

        isStickerCollected: (section, id) => {
          const state = get()
          return Boolean(state[section]?.[id])
        },
      }
    },
    {
      name: 'swx_album_v1',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        if (!persistedState) {
          return currentState
        }

        const persisted = persistedState as Partial<AlbumState>

        const merged: AlbumState & AlbumActions = {
          ...currentState,
          ...persisted,
          points: typeof persisted.points === 'number' ? persisted.points : INITIAL_POINTS,
          specialAssignments: {
            films: { ...currentState.specialAssignments.films, ...(persisted.specialAssignments?.films ?? {}) },
            people: { ...currentState.specialAssignments.people, ...(persisted.specialAssignments?.people ?? {}) },
            starships: { ...currentState.specialAssignments.starships, ...(persisted.specialAssignments?.starships ?? {}) },
          },
        }

        ;(['films', 'people', 'starships'] as Section[]).forEach((section) => {
          const sectionMap = { ...(merged[section] as Record<number, Sticker | null>) }

          Object.entries(sectionMap).forEach(([idKey, sticker]) => {
            if (!sticker) return
            const id = Number(idKey)
            if (!merged.specialAssignments[section][id]) {
              merged.specialAssignments[section][id] = sticker.specialClass ?? getRandomSpecialClass()
            }

            sectionMap[id] = {
              ...sticker,
              specialClass: sticker.specialClass ?? merged.specialAssignments[section][id] ?? null,
            }
          })

          merged[section] = sectionMap
        })

        return merged
      },
    }
  )
)

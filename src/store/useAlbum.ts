import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AlbumState, Sticker } from '@/types/album'

const initialAlbum = (): AlbumState => ({
  films: Object.fromEntries(Array.from({ length: 6 }, (_, i) => [i + 1, null])),
  people: Object.fromEntries(Array.from({ length: 82 }, (_, i) => [i + 1, null])),
  starships: Object.fromEntries(Array.from({ length: 36 }, (_, i) => [i + 1, null])),
})

interface AlbumActions {
  addSticker: (sticker: Sticker) => void
  resetAlbum: () => void
}

export const useAlbum = create(
  persist<AlbumState & AlbumActions>(
    (set) => ({
      ...initialAlbum(),

      addSticker: (sticker: Sticker) => {
        set((state: AlbumState) => {
          const section = state[sticker.section] as Record<number, Sticker | null>
          // Evita duplicados: solo agrega si no existe
          if (!section[sticker.id]) {
            section[sticker.id] = sticker
          }
          return { ...state }
        })
      },

      resetAlbum: () => set(() => initialAlbum()),
    }),
    {
      name: 'swx_album_v1', // clave en localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
)

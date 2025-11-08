import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useEffect, useState } from 'react'

const COOLDOWN_MS = 60_000
const STORAGE_KEY = 'swx_pack_state_v1'

export const PACK_IDS = [1, 2, 3, 4] as const

export type PackId = (typeof PACK_IDS)[number]

interface PackState {
  activePackId: PackId | null
  cooldownUntil: number | null
  openPack: (packId: PackId) => boolean
  finishPack: () => void
  clearCooldown: () => void
}

const sanitizeCooldown = (cooldownUntil: number | null) => {
  if (!cooldownUntil) return null
  return cooldownUntil > Date.now() ? cooldownUntil : null
}

export const usePacks = create(
  persist<PackState>(
    (set, get) => ({
      activePackId: null,
      cooldownUntil: null,
      openPack: (packId) => {
        const { activePackId, cooldownUntil } = get()
        const sanitizedCooldown = sanitizeCooldown(cooldownUntil)

        if (activePackId !== null) {
          return activePackId === packId
        }

        if (sanitizedCooldown && Date.now() < sanitizedCooldown) {
          return false
        }

        set({
          activePackId: packId,
          cooldownUntil: Date.now() + COOLDOWN_MS,
        })

        return true
      },
      finishPack: () => {
        set((state) => ({
          activePackId: null,
          cooldownUntil: sanitizeCooldown(state.cooldownUntil),
        }))
      },
      clearCooldown: () => set({ cooldownUntil: null }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activePackId: state.activePackId,
        cooldownUntil: sanitizeCooldown(state.cooldownUntil),
      }),
    }
  )
)

const getRemainingSeconds = (cooldownUntil: number | null) => {
  if (!cooldownUntil) return 0
  const diff = cooldownUntil - Date.now()
  return diff > 0 ? Math.ceil(diff / 1000) : 0
}

export const usePackCooldownSeconds = () => {
  const cooldownUntil = usePacks((state) => sanitizeCooldown(state.cooldownUntil))
  const clearCooldown = usePacks((state) => state.clearCooldown)
  const [seconds, setSeconds] = useState(() => getRemainingSeconds(cooldownUntil))

  useEffect(() => {
    if (!cooldownUntil) {
      setSeconds(0)
      return
    }

    const update = () => {
      const remaining = getRemainingSeconds(cooldownUntil)
      if (remaining <= 0) {
        clearCooldown()
        setSeconds(0)
      } else {
        setSeconds(remaining)
      }
    }

    update()
    const interval = window.setInterval(update, 1000)

    return () => window.clearInterval(interval)
  }, [clearCooldown, cooldownUntil])

  return seconds
}

export const isPackLocked = (packId: PackId, activePackId: PackId | null, cooldownSeconds: number) => {
  if (activePackId === packId) return false
  return cooldownSeconds > 0
}

export const isAnyPackLocked = (cooldownSeconds: number) => cooldownSeconds > 0

export const formatCooldown = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds)
  const minutes = Math.floor(safeSeconds / 60)
  const remainder = safeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

import { create } from 'zustand'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  message: string
  type: NotificationType
}

interface NotificationStore {
  notifications: Notification[]
  addNotification: (message: string, type?: NotificationType) => void
  removeNotification: (id: string) => void
  clear: () => void
}

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const DEFAULT_TIMEOUT = 3500

export const useNotifications = create<NotificationStore>((set, get) => ({
  notifications: [],

  addNotification: (message, type = 'info') => {
    const id = generateId()
    const notification = { id, message, type }

    set((state) => ({
      notifications: [...state.notifications, notification],
    }))

    setTimeout(() => {
      get().removeNotification(id)
    }, DEFAULT_TIMEOUT)
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    }))
  },

  clear: () => set({ notifications: [] }),
}))


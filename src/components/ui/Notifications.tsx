import { useNotifications } from '@/store/useNotifications'

const typeToAlertClass = {
  success: 'alert-success',
  error: 'alert-error',
  warning: 'alert-warning',
  info: 'alert-info',
} as const

export const NotificationCenter = () => {
  const notifications = useNotifications((state) => state.notifications)

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-[1000] space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`alert shadow-lg animate-slide-in-right ${typeToAlertClass[notification.type]}`}
        >
          <span>{notification.message}</span>
        </div>
      ))}
    </div>
  )
}

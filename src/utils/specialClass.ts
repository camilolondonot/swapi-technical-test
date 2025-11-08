import type { SpecialClass } from '@/types/api'

const SPECIAL_CLASSES: SpecialClass[] = ['gold', 'limited', null]
const SPECIAL_CLASS_PROBABILITY = 0.15 // 15% de probabilidad de ser especial

/**
 * Asigna aleatoriamente una clase especial a una carta
 * @returns Clase especial (gold, limited) o null
 */
export const getRandomSpecialClass = (): SpecialClass => {
  if (Math.random() > SPECIAL_CLASS_PROBABILITY) {
    return null
  }
  
  // Si es especial, elegir entre gold o limited
  return Math.random() > 0.5 ? 'gold' : 'limited'
}

/**
 * Obtiene las clases CSS para una carta especial con buen contraste en dark/light
 */
export const getSpecialClassNames = (specialClass: SpecialClass): string => {
  if (!specialClass) return ''
  
  const baseClasses = 'border-2 shadow-lg transform transition-all'
  
  switch (specialClass) {
    case 'gold':
      // Usar clases que funcionan bien en ambos temas
      return `${baseClasses} border-warning/80 bg-base-100 shadow-warning/30 ring-2 ring-warning/20`
    case 'limited':
      return `${baseClasses} border-secondary/80 bg-base-100 shadow-secondary/30 ring-2 ring-secondary/20`
    default:
      return ''
  }
}


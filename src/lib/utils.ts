import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export function formatCurrency(amount: number, currency: string = 'XOF'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function calculateQhseScore(actions: { status: string; dueDate: Date; completedAt?: Date | null }[]): number {
  if (actions.length === 0) return 100
  
  const completedOnTime = actions.filter(a => 
    a.status === 'completed' && a.completedAt && new Date(a.completedAt) <= new Date(a.dueDate)
  ).length
  
  const overdue = actions.filter(a => 
    a.status !== 'completed' && new Date(a.dueDate) < new Date()
  ).length
  
  const baseScore = (completedOnTime / actions.length) * 100
  const penalty = overdue * 5
  
  return Math.max(0, Math.min(100, Math.round(baseScore - penalty)))
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-600'
  }
  return colors[priority] || 'bg-gray-500'
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    todo: 'bg-gray-500',
    in_progress: 'bg-blue-500',
    completed: 'bg-green-500',
    cancelled: 'bg-gray-400',
    new: 'bg-yellow-500',
    resolved: 'bg-green-500'
  }
  return colors[status] || 'bg-gray-500'
}

export function getDomainLabel(domain: string): string {
  const labels: Record<string, string> = {
    quality: 'Qualité',
    hygiene: 'Hygiène',
    safety: 'Sécurité',
    environment: 'Environnement'
  }
  return labels[domain] || domain
}

export function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    low: 'Faible',
    medium: 'Moyenne',
    high: 'Élevée',
    critical: 'Critique'
  }
  return labels[priority] || priority
}

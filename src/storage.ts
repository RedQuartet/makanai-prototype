import type { Application } from './types'

const KEYS = { visited: 'makanai:visited', favorites: 'makanai:favorites', applications: 'makanai:applications' }

function read<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch { return fallback }
}

export const storage = {
  hasVisited: () => read<boolean>(KEYS.visited, false),
  markVisited: () => localStorage.setItem(KEYS.visited, 'true'),
  getFavorites: () => read<string[]>(KEYS.favorites, []),
  setFavorites: (ids: string[]) => localStorage.setItem(KEYS.favorites, JSON.stringify(ids)),
  getApplications: () => read<Application[]>(KEYS.applications, []),
  setApplications: (applications: Application[]) => localStorage.setItem(KEYS.applications, JSON.stringify(applications)),
}

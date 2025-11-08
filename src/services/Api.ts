import axios from 'axios'
import type { Person, Film, Starship } from '@/types/api'

const API_URL = import.meta.env.VITE_API_URL || 'https://swapi.dev/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getFilms = async () => {
  const response = await api.get('/films')
  return response.data
}

export const getPeople = async () => {
  const response = await api.get('/people')
  return response.data
}

export const getPersonById = async (id: string) => {
  const response = await api.get(`/people/${id}`)
  return response.data
}

export const getStarships = async () => {
  const response = await api.get('/starships')
  return response.data
}

export const getAllCollections = async () => {
  const [people, films, starships] = await Promise.all([
    getPeople(),
    getFilms(),
    getStarships(),
  ])

  return {
    people: (people.results ?? []) as Person[],
    films: (films.results ?? []) as Film[],
    starships: (starships.results ?? []) as Starship[],
    counts: {
      people: typeof people.count === 'number' ? people.count : (people.results?.length ?? 0),
      films: typeof films.count === 'number' ? films.count : (films.results?.length ?? 0),
      starships: typeof starships.count === 'number' ? starships.count : (starships.results?.length ?? 0),
    },
  }
}

const resourceCache = new Map<string, Promise<unknown>>()

export const fetchResourceByUrl = async <T>(url: string): Promise<T> => {
  const normalizedUrl = url.startsWith('http') ? url : url.startsWith('/') ? url : `/${url}`
  const client = url.startsWith('http') ? axios : api
  const cacheKey = `${client.defaults.baseURL ?? 'ROOT'}|${normalizedUrl}`

  if (!resourceCache.has(cacheKey)) {
    const request = client
      .get<T>(normalizedUrl)
      .then((response) => response.data)
      .catch((error) => {
        resourceCache.delete(cacheKey)
        throw error
      })
    resourceCache.set(cacheKey, request)
  }

  return (await resourceCache.get(cacheKey)) as T
}

export default api
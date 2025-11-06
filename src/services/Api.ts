import axios from 'axios'

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

export default api
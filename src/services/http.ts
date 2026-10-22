import axios from 'axios'

// As URLs ficam no .env e são configuradas em um único local.
export const wiki = axios.create({ baseURL: import.meta.env.VITE_WIKI_URL })
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })
export const wikidata = axios.create({ baseURL: import.meta.env.VITE_WIKIDATA_URL })

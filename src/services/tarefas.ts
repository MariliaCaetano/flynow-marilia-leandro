import axios from 'axios'
import { api } from './http'

export type Tarefa = { id: number; todo: string; completed: boolean; userId: number }

export async function criarTarefa(todo: string): Promise<Tarefa> {
  const { data } = await api.post<Tarefa>('/todos/add', { todo, completed: false, userId: 1 })
  return data
}

export async function testarErro404(): Promise<string> {
  try {
    await api.get('/404/nao-achei')
    return 'A API não retornou o erro esperado.'
  } catch (err) {
    if (axios.isAxiosError(err)) return `Erro HTTP ${err.response?.status ?? 'sem resposta'} (Axios)`
    return 'Erro inesperado ao consultar a API.'
  }
}

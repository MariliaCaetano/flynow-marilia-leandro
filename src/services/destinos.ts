import { wikidata, wiki } from './http'
import type { Destino } from '../types'

type WikidataBinding = {
  item: { value: string }
  itemLabel: { value: string }
  itemDescription?: { value: string }
  countryLabel?: { value: string }
  image?: { value: string }
}

type WikidataResponse = { results: { bindings: WikidataBinding[] } }
type WikiSummary = { title: string; extract: string }

const query = `
  SELECT ?item ?itemLabel ?itemDescription ?countryLabel ?image WHERE {
    VALUES ?item {
      wd:Q90 wd:Q174 wd:Q84 wd:Q1490 wd:Q8678
      wd:Q597 wd:Q1492 wd:Q60 wd:Q36947 wd:Q34600
    }
    OPTIONAL { ?item wdt:P17 ?country. }
    OPTIONAL { ?item wdt:P18 ?image. }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "pt,en". }
  }
`

// GET Axios, com transformação da resposta por map e remoção de duplicatas.
export async function listarDestinos(signal?: AbortSignal): Promise<Destino[]> {
  const resposta = await wikidata.get<WikidataResponse>('/sparql', {
    params: { query, format: 'json' },
    headers: { Accept: 'application/sparql-results+json' },
    signal,
  })
  if (resposta.status !== 200) throw new Error(`Wikidata respondeu HTTP ${resposta.status}`)

  const lista = resposta.data.results.bindings.map((binding, indice) => {
    const codigo = binding.item.value.split('/').pop() ?? ''
    return {
      id: binding.item.value,
      cidade: binding.itemLabel.value,
      descricao: binding.itemDescription?.value ?? 'Cidade para conhecer.',
      pais: binding.countryLabel?.value ?? 'Destino turístico',
      imagem: binding.image?.value.replace(/^http:/, 'https:'),
      link: `https://www.wikidata.org/wiki/${codigo}`,
      // Valores fictícios para exercitar filter e reduce; não representam tarifas reais.
      preco: [800, 600, 2400, 520, 1100, 450, 900, 620, 1800, 580][indice % 10],
    }
  })

  return Array.from(new Map(lista.map((destino) => [destino.id, destino])).values())
}

// Segundo exemplo de GET pedido no PDF: Wikipedia REST.
export async function consultarWikipedia(): Promise<WikiSummary[]> {
  const titulos = ['Rio_de_Janeiro', 'Lisbon', 'Tokyo']
  const respostas = await Promise.all(
    titulos.map((titulo) => wiki.get<WikiSummary>(`/page/summary/${titulo}`)),
  )
  return respostas.map(({ data }) => ({ title: data.title, extract: data.extract }))
}

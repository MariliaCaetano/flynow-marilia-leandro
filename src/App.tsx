import { useEffect, useState } from 'react'
import Header from './components/Header'
import DestinoForm from './components/DestinoForm'
import DestinoLista from './components/DestinoLista'
import type { Contato, Destino } from './types'
import { listarDestinos } from './services/destinos'

function App() {
  const [destinos, setDestinos] = useState<Destino[]>([])
  const [minhaViagem, setMinhaViagem] = useState<Destino[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const [ultimoContato, setUltimoContato] = useState<Contato | null>(null)
  const [soBaratos, setSoBaratos] = useState(false)
  const [busca, setBusca] = useState('')
  const [ordenar, setOrdenar] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function carregarDestinos() {
      try {
        setCarregando(true)
        setErro('')
        const lista = await listarDestinos(controller.signal)
        if (lista.length === 0) {
          throw new Error('A API não retornou destinos.')
        }

        if (!controller.signal.aborted) {
          setDestinos(lista)
        }
      } catch (error) {
        if (controller.signal.aborted) return
        console.error('Falha na consulta pública ao Wikidata:', error)
        setDestinos([])
        setErro(error instanceof Error ? error.message : 'Não foi possível acessar o Wikidata.')
      } finally {
        if (!controller.signal.aborted) setCarregando(false)
      }
    }

    carregarDestinos()
    return () => controller.abort()
  }, [tentativa])

  // HOF: filtro, busca, ordenação de uma cópia e soma derivados do estado.
  const filtrados = destinos.filter((destino) =>
    (!soBaratos || destino.preco <= 650) &&
    destino.cidade.toLowerCase().includes(busca.trim().toLowerCase()),
  )
  const visiveis = ordenar ? [...filtrados].sort((a, b) => a.preco - b.preco) : filtrados
  const total = visiveis.reduce((soma, destino) => soma + destino.preco, 0)

  // DOM: efeito altera o título da aba sempre que a lista visível muda.
  useEffect(() => {
    document.title = `${visiveis.length} destinos | FlyNow`
  }, [visiveis.length])

  function adicionarDestino(destino: Destino) {
    setMinhaViagem((anterior) =>
      anterior.some((item) => item.id === destino.id)
        ? anterior
        : [...anterior, destino],
    )
  }

  function removerDestino(id: string) {
    setMinhaViagem((anterior) => anterior.filter((item) => item.id !== id))
  }

  function handleEnviarFormulario(contato: Contato) {
    // Somente estado local: nada é enviado ou gravado na API.
    setUltimoContato(contato)
  }

  return (
    <div className="app">
      <Header
        titulo="Minha Lista de Viagem"
        subtitulo="Descubra lugares e monte sua lista de destinos para conhecer."
        quantidade={minhaViagem.length}
      />

      <main className="main">
        <div className="intro">
          <p className="eyebrow">Explore o mundo</p>
          <h2>Encontre seu próximo destino</h2>
          <p>Conheça cidades com informações e imagens de dados públicos do Wikidata.</p>
        </div>

        {carregando && <p className="status" role="status">Buscando destinos para você...</p>}
        {erro && (
          <div className="error" role="alert">
            <p>Não foi possível carregar os destinos. Verifique sua conexão e tente novamente.</p>
            <button type="button" className="retry-button" onClick={() => setTentativa((valor) => valor + 1)}>
              Tentar novamente
            </button>
          </div>
        )}
        <section className="card aula8-card" aria-labelledby="titulo-aula8">
          <h2 id="titulo-aula8">Encontre a viagem ideal</h2>
          <p className="muted">Explore cidades e compare valores ilustrativos. Os preços não são ofertas reais.</p>
          <div className="aula8-controls">
            <button type="button" onClick={() => setSoBaratos((valor) => !valor)}>
              {soBaratos ? 'Mostrar todos' : 'Só até R$ 650'}
            </button>
            <button type="button" onClick={() => setOrdenar((valor) => !valor)}>
              {ordenar ? 'Ordem original' : 'Ordenar por preço'}
            </button>
            <input aria-label="Buscar destino por nome" value={busca} placeholder="Buscar por cidade" onChange={(event) => setBusca(event.target.value)} />
          </div>
          <p><strong>{visiveis.length}</strong> destinos · soma dos valores ilustrativos: <strong>R$ {total.toLocaleString('pt-BR')}</strong></p>
        </section>

        {!carregando && !erro && (
          <DestinoLista
            destinos={visiveis}
            selecionados={minhaViagem.map((destino) => destino.id)}
            onAdicionar={adicionarDestino}
          />
        )}

        <section className="card viagem-card" id="minha-viagem" aria-labelledby="titulo-minha-viagem">
          <div className="section-title">
            <div>
              <p className="eyebrow">Sua seleção</p>
              <h2 id="titulo-minha-viagem">Minha Viagem</h2>
            </div>
            <span className="count" aria-label={`${minhaViagem.length} destinos selecionados`}>
              {minhaViagem.length}
            </span>
          </div>

          {minhaViagem.length === 0 ? (
            <p className="muted">
              Nenhum destino selecionado. Adicione uma cidade nos cartões acima.
            </p>
          ) : (
            <ul className="viagem-lista">
              {minhaViagem.map((destino) => (
                <li className="viagem-item" key={destino.id}>
                  <a href={destino.link} target="_blank" rel="noopener noreferrer">
                    <strong>{destino.cidade}</strong>
                    <span>{destino.pais} ↗</span>
                  </a>
                  <button type="button" onClick={() => removerDestino(destino.id)}>
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="local-note">Lista local: nenhuma informação é gravada na API.</p>
        </section>

        <DestinoForm
          onEnviar={handleEnviarFormulario}
          ultimoContato={ultimoContato}
        />
      </main>

      <footer className="footer">FlyNow · Seu próximo destino começa aqui.</footer>
    </div>
  )
}

export default App

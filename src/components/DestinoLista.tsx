import type { Destino } from '../types'

type DestinoListaProps = {
  destinos: Destino[]
  selecionados: string[]
  onAdicionar: (destino: Destino) => void
}

export default function DestinoLista({ destinos, selecionados, onAdicionar }: DestinoListaProps) {
  return (
    <section className="card" aria-labelledby="titulo-destinos">
      <div className="section-title">
        <div>
          <p className="eyebrow">Dados públicos</p>
          <h2 id="titulo-destinos">Destinos para conhecer</h2>
        </div>
        <span className="count" aria-label={`${destinos.length} destinos disponíveis`}>
          {destinos.length}
        </span>
      </div>

      {destinos.length === 0 ? (
        <p className="muted">Nenhum destino disponível no momento.</p>
      ) : (
        <ul className="destino-lista">
          {destinos.map((destino) => {
            const adicionado = selecionados.includes(destino.id)

            return (
              <li className="destino-item" key={destino.id}>
                <a
                  className="destino-link"
                  href={destino.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Conhecer ${destino.cidade} no Wikidata (abre em nova aba)`}
                >
                  <div className="destino-foto">
                    <span className="foto-fallback" aria-hidden="true">✈</span>
                    {destino.imagem && (
                      <img
                        src={destino.imagem}
                        alt={`Vista de ${destino.cidade}`}
                        loading="lazy"
                        onError={(event) => { event.currentTarget.style.display = 'none' }}
                      />
                    )}
                  </div>
                  <div className="destino-info">
                    <small>{destino.pais}</small>
                    <div className="destino-title">
                      <strong>{destino.cidade}</strong>
                      <span className="arrow" aria-hidden="true">↗</span>
                    </div>
                    <p>{destino.descricao}</p>
                    <p className="preco-exemplo">Preço fictício: R$ {destino.preco.toLocaleString('pt-BR')}</p>
                    <span className="saber-mais">Conhecer destino no Wikidata</span>
                  </div>
                </a>
                <button
                  type="button"
                  className="add-button"
                  disabled={adicionado}
                  onClick={() => onAdicionar(destino)}
                >
                  {adicionado ? '✓ Adicionado à minha viagem' : '+ Adicionar à minha viagem'}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Contato } from '../types'

type DestinoFormProps = {
  onEnviar: (contato: Contato) => void
  ultimoContato: Contato | null
}

export default function DestinoForm({ onEnviar, ultimoContato }: DestinoFormProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviado, setEnviado] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onEnviar({ nome, email, mensagem })
    setNome('')
    setEmail('')
    setMensagem('')
    setEnviado(true)
  }

  return (
    <section className="card" aria-labelledby="titulo-contato">
      <div className="section-title">
        <div>
          <p className="eyebrow">Contato</p>
          <h2 id="titulo-contato">Planeje sua próxima viagem</h2>
        </div>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Nome
          <input
            type="text"
            value={nome}
            onChange={(event) => { setNome(event.target.value); setEnviado(false) }}
            placeholder="Seu nome"
            required
          />
        </label>

        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(event) => { setEmail(event.target.value); setEnviado(false) }}
            placeholder="seu@email.com"
            required
          />
        </label>

        <label>
          Destino de interesse / mensagem
          <textarea
            value={mensagem}
            onChange={(event) => { setMensagem(event.target.value); setEnviado(false) }}
            placeholder="Conte para onde você gostaria de viajar..."
            rows={4}
            required
          />
        </label>

        <button type="submit">Registrar interesse</button>

        {enviado && ultimoContato && (
          <p className="success" role="status">
            Interesse de {ultimoContato.nome} registrado nesta tela. Os campos foram limpos;
            nenhum dado foi enviado ou salvo na API.
          </p>
        )}
      </form>
    </section>
  )
}

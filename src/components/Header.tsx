import flyNowLogo from '../assets/flynow-logo.png'

type HeaderProps = {
  titulo: string
  subtitulo: string
  quantidade: number
}

export default function Header({ titulo, subtitulo, quantidade }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="brand">
          <img className="brand-logo" src={flyNowLogo} alt="FlyNow" />
        </div>
        <h1>{titulo}</h1>
        <p>{subtitulo}</p>
      </div>
      <a className="badge" href="#minha-viagem">
        Minha Viagem <span aria-label={`${quantidade} destinos`}>({quantidade})</span>
      </a>
    </header>
  )
}

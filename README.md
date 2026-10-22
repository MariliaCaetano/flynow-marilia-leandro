# FlyNow — Minha Lista de Viagem

Projeto da P1 — Laboratório de Programação Front-End.

## Executar

```bash
npm install
npm run dev
```

Abra o endereço indicado pelo Vite. A interface só mostra “HTTP 200” quando o Wikidata de fato responder com esse status e houver destinos na resposta. Confirme também em F12 → Network. Se a API estiver indisponível ou houver falha de rede, o aplicativo exibe o erro e oferece “Tentar novamente”; nenhum código front-end pode garantir que um serviço externo sempre responda 200.

## Recursos

- Vite, React 18 e TypeScript, sem backend ou banco de dados.
- Componentes `Header`, `DestinoForm` e `DestinoLista` com props.
- Consulta `fetch` à API pública Wikidata SPARQL, sem chave e sem `.env`.
- Cartões com foto (Wikimedia Commons quando fornecida pelo Wikidata), país, descrição e link para a página do destino no Wikidata.
- Botão de adicionar/remover destinos de “Minha Viagem” usando `useState` local.
- Formulário controlado com nome, e-mail e destino/mensagem; confirmação apenas na tela, sem envio à API.
- Renderização com `.map()` e `key` baseada no ID do Wikidata.

## Entrega

Compacte a pasta do projeto **sem `node_modules`** e renomeie o ZIP com o nome e sobrenome de ambos os integrantes, conforme o PDF da professora. Envie somente pelo AVA.
# Aula 8 — DOM, HOF, Axios e useEffect

Este projeto FlyNow foi atualizado para a Aula 8 (13/10/2026):

- **DOM:** o `useEffect` altera `document.title` de acordo com a contagem de destinos. Para fazer a experiência do console solicitada no PDF, abra F12 → Console e execute:
  ```js
  const titulo = document.querySelector('h1')
  titulo.textContent = 'FlyNow — bastidor'
  titulo.classList.add('destaque')
  document.querySelectorAll('li').length
  titulo.addEventListener('click', () => console.log('clicou!'))
  ```
  A mudança manual desaparece ao recarregar porque o React controla o DOM.
- **HOF:** botão “Só até R$ 650” com `filter`, lista com `map` e chaves por `id`, total com `reduce(..., 0)`; busca com `includes` e ordenação sobre cópia com `[...filtrados].sort(...)`.
- **Axios:** URLs definidas no `.env`; instâncias em `src/services/http.ts`; GET do Wikidata, GET opcional da Wikipedia, POST de teste no DummyJSON e leitura de erro 404 com `axios.isAxiosError`.
- **useEffect:** carrega destinos ao iniciar, exibindo carregamento/erro/lista ou lista vazia, com `try/catch/finally` e cancelamento ao desmontar. Outro efeito atualiza o título da aba.

**Importante:** os preços utilizados são *fictícios*, definidos apenas para permitir o exercício de HOF. O POST do DummyJSON também é simulado, sem persistência.

**Apresentação final:** a interface pública não inclui botões de testes de API nem mensagens HTTP. Os exemplos de GET Wikipedia, POST e erro 404 permanecem em `src/services/destinos.ts` e `src/services/tarefas.ts` para consulta e demonstração em código. Não são disparados automaticamente ao abrir o site. O GET de destinos, por sua vez, é realmente executado pelo FlyNow.

Para executar: `npm install`, depois `npm run dev`. Para verificar: `npm run build`.
Se o projeto for clonado do GitHub, copie `.env.example` para `.env` antes de iniciar o Vite; o `.env` não é versionado.

Para verificar os endpoints POST e 404 de forma independente da interface, execute `npm run verificar:aula8` (requer internet). O script faz as chamadas HTTP e confere os status com asserções. As chamadas feitas na aplicação usam Axios, nos arquivos `src/services`.

Respostas rápidas dos exercícios do PDF:

1. `push` altera o array original, mantendo a mesma referência; use `setLista(anterior => [...anterior, novo])`.
2. Um `fetch` que recebe HTTP 404 resolve a Promise (é preciso testar `response.ok`); Axios rejeita a Promise e entra no `catch`.
3. `useEffect(..., [])` roda ao montar o componente (no Strict Mode de desenvolvimento pode rodar duas vezes); `[busca]` também roda quando `busca` muda.


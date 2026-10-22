// Exercícios de API da Aula 8. Execute com: npm run verificar:aula8
// Sem botões técnicos na interface pública do FlyNow.
import assert from 'node:assert/strict'

const base = 'https://dummyjson.com'

async function verificar() {
  const post = await fetch(`${base}/todos/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ todo: 'Revisar HOF', completed: false, userId: 1 }),
  })
  assert.equal(post.status, 201, 'O POST deveria retornar HTTP 201')
  const tarefa = await post.json()
  assert.equal(tarefa.todo, 'Revisar HOF')
  assert.ok(tarefa.id, 'A tarefa simulada precisa ter um ID')
  console.log(`OK POST: HTTP ${post.status}, tarefa ID ${tarefa.id}`)

  const inexistente = await fetch(`${base}/404/nao-achei`)
  assert.equal(inexistente.status, 404, 'A rota de teste deveria retornar HTTP 404')
  console.log('OK tratamento de erro: HTTP 404')
  console.log('Os serviços Axios equivalentes estão em src/services/tarefas.ts.')
}

verificar().catch((erro) => {
  console.error('Falha na verificação:', erro)
  process.exitCode = 1
})

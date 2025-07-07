
# Design System React

## Descrição

Este projeto é um **Design System** desenvolvido em React e TypeScript, com foco em componentes reutilizáveis, acessíveis e estilizados para aplicações web modernas. Ele inclui componentes essenciais como botões, cards, formulários, inputs, labels, alerts e textareas, todos com estilos customizáveis via CSS.

## Funcionalidades

- Componentes desacoplados e reutilizáveis
- Tipagem forte com TypeScript
- Estilização modular via CSS
- Foco em acessibilidade e boas práticas de UI/UX
- Fácil integração em projetos React

## Componentes Disponíveis

- **Button**: Botão customizável com diferentes variantes e estados
- **Card**: Container para exibir conteúdos agrupados
- **Form**: Componente de formulário com validação
- **Input**: Campo de entrada de dados
- **Label**: Rótulo associado a inputs
- **Alert**: Mensagens de alerta e feedback
- **Textarea**: Campo de texto multilinha

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
npm install
```

## Uso

Importe e utilize os componentes no seu projeto React:

```tsx
import { Button, Card, Form, Input, Label, Alert, Textarea } from './components';

function App() {
  return (
    <Card>
      <Form>
        <Label htmlFor="nome">Nome</Label>
        <Input id="nome" />
        <Textarea id="mensagem" />
        <Button type="submit">Enviar</Button>
        <Alert type="success" message="Mensagem enviada!" />
      </Form>
    </Card>
  );
}
```

## Scripts Disponíveis

- `npm start` — Inicia o projeto em modo desenvolvimento
- `npm run build` — Gera a versão de produção
- `npm test` — Executa os testes automatizados

## Estrutura de Pastas

```
src/
  components/
    button.tsx
    card.tsx
    form.tsx
    input.tsx
    label.tsx
    alert.tsx
    textarea.tsx
  App.tsx
  main.tsx
  index.css
```

## Customização

Os estilos podem ser facilmente customizados editando o arquivo `index.css` ou sobrescrevendo classes nos seus próprios arquivos de estilo.

## Contribuição

Contribuições são bem-vindas!  
Para contribuir, faça um fork do projeto, crie uma branch com sua feature ou correção, e envie um pull request.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

# Colégio Favo - Monorepo Enterprise

Este é o repositório principal do ecossistema do **Colégio Favo**, utilizando uma arquitetura monorepo baseada em `pnpm` e `Turborepo`.

## Estrutura do Projeto

* **`apps/`**
  * `web`: Aplicação Web Next.js 15
  * `mobile`: Aplicativo Mobile Expo
  * `backend`: API Rest NestJS
  * `docs`: Documentação geral
* **`packages/`**
  * `ui`: Design system e componentes compartilhados (Shadcn/UI)
  * `theme`: Temas e tokens de design (Tailwind/NativeWind)
  * `types`: Tipagens TypeScript globais
  * ... (outros pacotes compartilhados)
* **`infra/`**
  * Scripts e arquivos docker-compose para provisionamento na VPS

## Como Rodar Localmente

1. Instale o `pnpm` globalmente se não tiver: `npm i -g pnpm`
2. Instale as dependências: `pnpm install`
3. Execute o ambiente de desenvolvimento: `pnpm dev`

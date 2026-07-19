---
name: site-cms-management
description: >
  Guia de arquitetura, expansão e manutenção do sistema de CMS dinâmico
  e uploads do ecossistema Colégio Favo (NestJS, React, Prisma).
---

# Site CMS Management & Architecture

Este guia documenta o padrão de arquitetura adotado para o CMS dinâmico do Colégio Favo de Mel, incluindo a persistência de arquivos estáticos, endpoints da API NestJS e renderização condicional no frontend.

## Arquitetura de Dados (Prisma Schema)

Os dados dinâmicos do site são controlados por dois modelos principais definidos no [schema.prisma](file:///c:/Users/Henrique%20-%20PC/Desktop/Projetos%20Dev/colegio-favo/prisma/schema.prisma):

1. **`SiteConfig`**: Par de chave-valor para configurações globais.
   * `key` (String, `@id`): Identificador único (ex: `school_phone`, `school_address`).
   * `value` (String): Valor textual atribuído.
2. **`SiteItem`**: Itens dinâmicos das seções (ex: manifesto, etapas/segmentos, galeria).
   * `id` (String, `@id`, `default(uuid)`): Identificador único do item.
   * `section` (String): Seção do site à qual o item pertence (ex: `manifesto`, `programs`, `gallery`, `marquee`).
   * `title` (String?): Título do item.
   * `description` (String?): Descrição/texto longo do item.
   * `extra` (String?): Informações adicionais (ex: idade sugerida, ponto decimal, classes de span).
   * `imageUrl` (String?): URL da imagem cadastrada/upload.
   * `order` (Int): Ordenação de exibição.

## Backend NestJS (`apps/backend/src/site-config/`)

O módulo `site-config` expõe os seguintes serviços e rotas:

### Endpoints da API
* **`GET /api/site-config`** (Público):
  * Retorna um mapa contendo as configurações globais (`configs`) e listas de itens ordenadas e agrupadas por seção.
* **`PUT /api/site-config`** (Autenticado):
  * Salva alterações em lote. Cria/atualiza chaves em `SiteConfig` e gerencia inserções, atualizações e exclusões de `SiteItem` (exclusão identificada por `delete: true` no payload do item).
* **`POST /api/site-config/upload`** (Autenticado):
  * Intercepta arquivos com Multer e armazena na pasta mapeada para uploads.
  * Retorna o path da imagem pública no formato `/favo-api/uploads/<filename>`.

### Upload e Servidor de Estáticos
Os arquivos de upload ficam salvos na pasta `/app/uploads` (mapeada no Docker Volume em produção) e localmente em `../../uploads` em desenvolvimento.
* O NestJS serve os estáticos em `main.ts` sob o prefixo `/uploads`.
* A URL resultante é servida sob o proxy Caddy em `/favo-api/uploads/*`.

## Frontend React (`apps/web/`)

### Painel Administrativo (`SiteManagement.jsx`)
Adicionado como aba no Sidebar principal da diretoria (`Gestao.jsx`), com os seguintes formulários em abas:
* **Geral:** Informações básicas como telefones, endereço e nota Google.
* **Essência:** Lista ordenável com os pontos do Manifesto Pedagógico.
* **Etapas:** Cadastro e alteração dos segmentos escolares com foto e faixa etária.
* **Ambiente:** Galeria de fotos com legendas e classes de span para dimensionamento na grade.
* **Palavras:** Termos rotativos do letreiro dinâmico (Marquee).

### Renderização Condicional e Segurança (Landing Page)
Siga estritamente estas regras de exibição na landing page ([Home.jsx](file:///c:/Users/Henrique%20-%20PC/Desktop/Projetos%20Dev/colegio-favo/apps/web/src/pages/Home.jsx)):
* **Hiding seções/cards vazios:** Se uma seção (ex: `programs`, `gallery`) não possuir itens ativos cadastrados, a seção inteira **deve retornar null** e sumir da viewport.
* **Hiding sem fotos:** Para cards que necessitam de imagens (como etapas e galeria), filtre os dados usando `.filter(item => item.imageUrl)` antes de mapear. Se o item não tiver imagem definida, **não exiba o card**.

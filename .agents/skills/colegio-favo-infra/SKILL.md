---
name: colegio-favo-infra
description: >-
  Guia de arquitetura, padrões e implantação de infraestrutura para o ecossistema Colégio Favo (Next.js, NestJS, Expo, Supabase, Evolution API, n8n). Use para entender a arquitetura do monorepo, regras do projeto e deploy na VPS 184.107.141.97.
---

# Skill de Infraestrutura e Arquitetura - Colégio Favo

Esta skill documenta os padrões estruturais do monorepo do **Colégio Favo** e as diretrizes para gerenciar e implantar a infraestrutura de serviços na VPS.

---

## 1. Padrões de Arquitetura e Convenções

O projeto segue as seguintes metodologias:
* **Clean Architecture & SOLID & DDD**: Separação clara de responsabilidades entre domínio, aplicação e infraestrutura.
* **Feature First**: Organização de código focada no módulo/funcionalidade (ex: `dashboard`, `finance`, `students`).
* **Component Driven Development**: Componentes atômicos e independentes no frontend.

### Convenções de Nomenclatura
* **camelCase**: Usado para nomes de variáveis, propriedades, funções e rotas internas.
* **PascalCase**: Usado para nomes de classes, tipos, interfaces e componentes React.
* **kebab-case**: Usado para nomes de diretórios, rotas de URL e chaves de arquivos de configuração.

---

## 2. Estrutura do Monorepo Local

```
colegio-favo/
├── apps/
│   ├── web/                     # Frontend Next.js 15 (App Router)
│   ├── mobile/                  # App Mobile Expo SDK (Expo Router)
│   ├── backend/                 # API Rest NestJS
│   └── docs/                    # Documentação do projeto
├── packages/                    # Pacotes compartilhados (Shared Libs)
│   ├── ui/                      # Componentes visuais (Shadcn/UI)
│   ├── theme/                   # Configuração de design tokens (Tailwind)
│   ├── types/                   # Tipagens TypeScript globais
│   ├── hooks/                   # Custom Hooks compartilhados
│   ├── utils/                   # Helpers e utilitários
│   ├── constants/               # Constantes globais
│   ├── services/                # SDKs e clientes de API
│   ├── validators/              # Validações estruturais (Zod)
│   ├── icons/                   # Wrapper de ícones
│   └── config/                  # tsconfig e eslint compartilhados
```

---

## 3. Detalhes da VPS (23.80.89.116)

A infraestrutura é executada em containers Docker sob uma VPS Linux Ubuntu isolada.
* **IP da VPS**: `23.80.89.116`
* **Usuário SSH**: `root` (Acesso via chave SSH sem senha configurado na máquina local)
* **Diretório do Projeto na VPS**: `/root/colegio-favo`

### Serviços e Endereços (escolafavodemel.com.br)
O proxy reverso Caddy expõe os seguintes serviços com SSL automático:
* **Web App (Frontend)**: `https://escolafavodemel.com.br` / `https://www.escolafavodemel.com.br` (Porta interna 3030)
* **Backend API**: `https://api.escolafavodemel.com.br` (Porta interna 3031)
* **Supabase Kong (API Gateway)**: `https://supabase.escolafavodemel.com.br` (Porta interna 8030)
* **Supabase Studio (Dashboard)**: `https://studio.escolafavodemel.com.br` (Porta interna 8031)
* **Evolution API (WhatsApp)**: `https://whatsapp.escolafavodemel.com.br` (Porta interna 3035)
* **n8n (Automação)**: `https://n8n.escolafavodemel.com.br` (Porta interna 3032)
* **Supabase PostgreSQL 15**: `127.0.0.1:5436` (Host VPS)

---

## 4. Comandos de Gerenciamento da VPS

### Status dos containers
```bash
ssh root@23.80.89.116 "docker ps --filter 'name=favo-'"
```

### Reiniciar serviços
```bash
ssh root@23.80.89.116 "cd /root/colegio-favo && docker compose up -d"
```

---

## 5. Regras Críticas para Desenvolvimento
1. **NÃO utilizar referências ou pacotes de `emergent.sh`** (como `@emergentbase/visual-edits`). Todas as dependências de lint ou scripts externos devem ser padrão ou do domínio `colegiofavo.com.br`.
2. **NÃO mockar dados nas etapas finais**: Toda a lógica deve conversar diretamente com instâncias reais de banco e serviços na VPS.

---
name: colegio-favo-app-architecture
description: >
  Guia completo de autenticação, controle de acessos (RBAC), portais,
  Dev Switcher e mapeamento de rotas no ecossistema Colégio Favo (NestJS + React).
---

# Colégio Favo App Architecture & Patterns

Este guia documenta o ecossistema de autenticação, gerenciamento de perfis (RBAC), o simulador de portais (Dev Switcher) e o roteamento de telas da aplicação web.

## 1. Sistema de Autenticação e Perfis (RBAC)

O sistema utiliza autenticação baseada em JWT (JSON Web Tokens) com controle de acesso baseado em cargos (Role-Based Access Control).

### Fluxo do Frontend (`apps/web/src/lib/auth.js`)
O frontend armazena a sessão localmente utilizando helpers em `auth.js`:
* `getToken()` / `setToken(token)`: Lê e grava o JWT token no localStorage.
* `getUser()` / `setUser(user)`: Lê e grava as informações básicas do usuário logado (incluindo o cargo `role`).
* `clearSession()`: Remove o token e os dados da sessão (usado no logout).
* `authHeader()`: Gera o cabeçalho HTTP necessário para requisições autenticadas: `{ headers: { Authorization: `Bearer ${token}` } }`.

### Fluxo do Backend (`apps/backend/src/auth/`)
* **`POST /api/auth/login`**: Valida credenciais e gera o token JWT.
* **`GET /api/auth/me`**: Endpoint autenticado que retorna o perfil do usuário logado e sua `role`.
* **Cargos (Roles) Disponíveis**:
  * `admin` e `diretoria`: Acesso total ao painel administrativo (Gestão).
  * `professor`, `coordenador`, `funcionario`, `aluno`, `responsavel`: Acesso restrito aos seus respectivos portais.

---

## 2. Roteamento e Mapeamento de Telas (`App.js`)

A navegação principal do portal de controle está mapeada no [App.js](file:///c:/Users/Henrique%20-%20PC/Desktop/Projetos Dev/colegio-favo/apps/web/src/App.js):
* **Páginas de Acesso Geral**:
  * `/`: Landing Page pública.
  * `/portal`: Tela de login unificada.
* **Mapeamento de Perfis (Rotas Customizadas)**:
  * `/portal/gestao`: Acessível apenas para `admin` ou `diretoria`.
  * `/portal/app`: Rota base para os portais específicos dos demais cargos.
* **Mapeamentos de Compatibilidade (Fallbacks em Inglês)**:
  Para suportar acessos legados ou URLs em inglês, rotas específicas são capturadas e redirecionadas para as respectivas views:
  * `/portal/teacher` ➔ Renderiza a view do **Professor**.
  * `/portal/coordinator` ➔ Renderiza a view do **Coordenador**.
  * `/portal/staff` ➔ Renderiza a view do **Funcionário**.

---

## 3. Dev Switcher (Simulador de Portais)

O **Dev Switcher** é um utilitário de desenvolvimento flutuante inserido para otimizar testes de perfis.

### Regras de Exibição
* **Ocultação na Home:** O Dev Switcher deve retornar `null` e não renderizar sob nenhuma circunstância na Landing Page pública (`/`).
* **Proteção por Cargo:** Ele só deve ser renderizado para usuários autenticados cujo cargo (`role`) seja `admin` ou `diretoria`.
* **Funcionalidade:** Permite simular a troca instantânea para qualquer um dos 6 portais ativos (Gestão, Aluno, Responsável, Professor, Coordenador, Funcionário) sem precisar deslogar da aplicação, alterando dinamicamente a `role` e redirecionando a rota.

---

## 4. Padrões de Rebranding e Layout
* **Nomenclatura Padrão:** O nome do estabelecimento foi alterado de "Colégio" para "**Centro Educacional** Favo de Mel" em todos os layouts públicos e privados.
* **Controle de Grid e Linhas:** Para o título principal no Hero, utilize tamanhos de fonte responsivos (`text-4xl sm:text-6xl lg:text-[5rem]`) para assegurar que a frase "CENTRO EDUCACIONAL" caiba em uma única linha no desktop e no mobile.

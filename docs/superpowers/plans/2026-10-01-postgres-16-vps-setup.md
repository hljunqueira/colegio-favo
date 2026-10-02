# Plano de Implantação: PostgreSQL 16 na VPS (23.80.89.116)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Subir e configurar uma instância isolada, segura e de alta performance do PostgreSQL 16 na VPS `23.80.89.116` (porta 5436), restabelecendo o túnel de desenvolvimento local e sincronizando o schema/seed do Colégio Favo.

**Architecture:** O PostgreSQL 16 rodará como container Docker (`postgres:16-alpine`) na VPS `23.80.89.116`, com bind exclusivo em `127.0.0.1:5436` (garantindo que o banco não fique exposto diretamente à internet). O acesso a partir da máquina de desenvolvimento é feito via túnel SSH seguro (`pnpm tunnel:db` mapeando `localhost:5432 -> 23.80.89.116:5436`). O schema e os dados iniciais são provisionados via Prisma (`prisma db push` e `prisma/seed.ts`).

**Tech Stack:** Docker, Docker Compose, PostgreSQL 16 (Alpine), OpenSSH Tunnel, Prisma ORM 7.x, TypeScript/Node.js, Crontab (Backup diário).

**Context / Estado Atual:**
- VPS Alvo: `23.80.89.116` (Ubuntu 24.04 LTS, Docker ativo, acesso SSH root sem senha verificado).
- Portas Postgres já ocupadas na VPS: 5433 (isabelrh) e 5435 (fisiostar).
- Porta designada e livre para o Colégio Favo: `5436` (já padronizada em `package.json` e `scripts/tunnel-db.ps1`).
- Docker da VPS secundária (`184.107.141.97`) foi removido pelo usuário, retornando o banco para a VPS principal.

## Global Constraints
- Imagem: `postgres:16-alpine` (mínimo consumo de RAM ~35MB e inicialização rápida).
- Bind de Porta: estritamente `127.0.0.1:5436:5432` no host da VPS (nunca `0.0.0.0`).
- Persistência: volume nomeado `favo_postgres16_data` gerenciado pelo Docker.
- Credenciais alinhadas com o monorepo (`POSTGRES_USER=postgres`, `POSTGRES_PASSWORD=favo_postgres_secure_2026_XyZ!`, `POSTGRES_DB=postgres`).
- Não impactar os demais containers em execução na VPS (`hlj-dev`, `isabelrh`, `fisiostar`).

---

## Tasks

### Task 1: Estruturação dos Arquivos de Configuração na VPS (23.80.89.116)

**Files:**
- Create na VPS: `/root/colegio-favo/database/docker-compose.yml`
- Create na VPS: `/root/colegio-favo/database/.env`

- [x] **Passo 1.1**: Conectar via SSH à VPS `23.80.89.116` e criar o diretório `/root/colegio-favo/database`.
- [x] **Passo 1.2**: Criar `/root/colegio-favo/database/.env` na VPS com as variáveis de ambiente:
  ```env
  POSTGRES_USER=postgres
  POSTGRES_PASSWORD=vJs0_yJMuDN57gdhiYojOZm8Gn0HvhOx
  POSTGRES_DB=postgres
  POSTGRES_PORT=5436
  TZ=America/Sao_Paulo
  JWT_SECRET=27ZLO2bVQfwV8dj1zh29VFxSYjLAimJGtWa2cKmLOBJ5adp44jyE0S_c5jtwkSIl
  ```
- [x] **Passo 1.3**: Criar `/root/colegio-favo/database/docker-compose.yml` na VPS com suporte a healthcheck, limites de memória e volume persistente:
  ```yaml
  version: '3.8'

  services:
    favo-postgres-16:
      container_name: favo-postgres-16
      image: postgres:16-alpine
      restart: always
      environment:
        POSTGRES_USER: ${POSTGRES_USER}
        POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
        POSTGRES_DB: ${POSTGRES_DB}
        TZ: ${TZ:-America/Sao_Paulo}
      ports:
        - "127.0.0.1:${POSTGRES_PORT:-5436}:5432"
      volumes:
        - favo_postgres16_data:/var/lib/postgresql/data
      healthcheck:
        test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
        interval: 10s
        timeout: 5s
        retries: 5
      deploy:
        resources:
          limits:
            memory: 1024M

  volumes:
    favo_postgres16_data:
      name: favo_postgres16_data
  ```

---

### Task 2: Inicialização e Verificação do PostgreSQL 16 na VPS

- [x] **Passo 2.1**: Subir o container com `docker compose up -d` a partir de `/root/colegio-favo/database`.
- [x] **Passo 2.2**: Validar se o container está com status `healthy`:
  ```bash
  ssh root@23.80.89.116 "docker ps --filter 'name=favo-postgres-16' --format '{{.Names}} - {{.Status}} - {{.Ports}}'"
  ```
- [x] **Passo 2.3**: Executar uma query de teste diretamente dentro do container para confirmar a versão exata do PostgreSQL:
  ```bash
  ssh root@23.80.89.116 "docker exec -i favo-postgres-16 psql -U postgres -d postgres -c 'SELECT version();'"
  ```
- [x] **Passo 2.4**: Checar se a porta `127.0.0.1:5436` está em escuta no host da VPS (`ss -tulpn | grep 5436`).

---

### Task 3: Validação do Túnel SSH Local

**Files:**
- Referência local: `package.json` (`tunnel:db`)
- Referência local: `scripts/tunnel-db.ps1`

- [x] **Passo 3.1**: Executar teste de abertura do túnel SSH em segundo plano ou verificar se conecta em `127.0.0.1:5436`.
- [x] **Passo 3.2**: Testar conectividade do PostgreSQL localmente pela porta 5432 (ou diretamente com node/pg script de verificação rápida).

---

### Task 4: Sincronização do Schema Prisma e Carga Inicial (Seed)

**Files:**
- Local: `.env` (ou variáveis locais de ambiente)
- Local: `prisma/schema.prisma`
- Local: `prisma/seed.ts`

- [x] **Passo 4.1**: Configurar ou garantir que o `.env` local aponte para:
  `DATABASE_URL="postgresql://postgres:vJs0_yJMuDN57gdhiYojOZm8Gn0HvhOx@localhost:5432/postgres?schema=public"`
- [x] **Passo 4.2**: Executar `pnpm exec prisma db push` para criar todas as tabelas, índices e enums no PostgreSQL 16.
- [x] **Passo 4.3**: Executar `pnpm exec tsx prisma/seed.ts` para popular as Roles, Usuários Administrativos (Diretoria, Coordenação, Professores), Turmas e Parâmetros.
- [x] **Passo 4.4**: Executar `prisma/migrations/rls.sql` se aplicável às políticas de segurança das tabelas de notas e alunos.

---

### Task 5: Script de Backup Automatizado (Garantia de Segurança)

**Files:**
- Create na VPS: `/root/colegio-favo/database/backup.sh`

- [x] **Passo 5.1**: Criar na VPS o script `/root/colegio-favo/database/backup.sh`:
  ```bash
  #!/bin/bash
  BACKUP_DIR="/root/colegio-favo/database/backups"
  mkdir -p $BACKUP_DIR
  DATE=$(date +%Y%m%d_%H%M%S)
  docker exec favo-postgres-16 pg_dump -U postgres postgres | gzip > "$BACKUP_DIR/favo_db_$DATE.sql.gz"
  # Manter últimos 7 dias
  find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +7 -delete
  ```
- [x] **Passo 5.2**: Tornar o script executável (`chmod +x /root/colegio-favo/database/backup.sh`) e adicionar no crontab (`0 3 * * * /root/colegio-favo/database/backup.sh`).

---

### Task 6: Atualização da Documentação e Skills do Projeto

**Files:**
- Modify: `.agents/skills/colegio-favo-infra/SKILL.md`
- Modify: `scripts/deploy-escolafavo-all.sh` e `scripts/deploy-escolafavo-backend.sh` (ajustar referência de IP se necessário)

- [x] **Passo 6.1**: Atualizar `SKILL.md` confirmando a VPS `23.80.89.116` e PostgreSQL 16 na porta 5436.
- [x] **Passo 6.2**: Confirmar que o comando `pnpm tunnel:db` e `scripts/tunnel-db.ps1` estão consistentes.

---

### Task 7: Configuração do Caddy na VPS (escolafavodemel.com.br e api.escolafavodemel.com.br)

**Files:**
- Modify na VPS: `/etc/caddy/Caddyfile`

- [x] **Passo 7.1**: Adicionar o bloco de rotas do Colégio Favo no `/etc/caddy/Caddyfile` da VPS:
  ```caddy
  # ==========================================
  # COLÉGIO FAVO (escolafavodemel.com.br)
  # ==========================================
  escolafavodemel.com.br, www.escolafavodemel.com.br {
      encode gzip zstd
      reverse_proxy localhost:3030 {
          header_up Host {host}
          header_up X-Real-IP {remote_host}
      }
  }

  api.escolafavodemel.com.br {
      encode gzip zstd
      reverse_proxy localhost:3031 {
          header_up Host {host}
          header_up X-Real-IP {remote_host}
      }
  }
  ```
- [x] **Passo 7.2**: Recarregar o Caddy para aplicar as configurações (`caddy reload --config /etc/caddy/Caddyfile`).
- [x] **Passo 7.3**: Validar status do Caddy (`systemctl status caddy`).
- [x] **Passo 7.4**: Orientar o apontamento DNS tipo A no provedor de domínio:
  - `escolafavodemel.com.br` -> `23.80.89.116`
  - `www.escolafavodemel.com.br` -> `23.80.89.116`
  - `api.escolafavodemel.com.br` -> `23.80.89.116`

---

### Task 8: Build e Subida do Backend (Porta 3031) e Frontend Web (Porta 3030)

**Files:**
- Create/Modify na VPS: `/root/colegio-favo/docker-compose.yml`

- [x] **Passo 8.1**: Configurar a stack completa dos serviços em `/root/colegio-favo/docker-compose.yml` integrando `favo-postgres-16`, `favo-backend` (porta 3031) e `favo-web` (porta 3030).
- [x] **Passo 8.2**: Subir os serviços com `docker compose up -d`.
- [x] **Passo 8.3**: Testar localmente na VPS:
  - `curl -I http://localhost:3030` (Frontend)
  - `curl -I http://localhost:3031/api/docs` (Swagger / API Backend)
- [x] **Passo 8.4**: Testar via domínio público HTTPS assim que a propagação DNS for concluída.


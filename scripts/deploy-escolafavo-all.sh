#!/bin/bash
set -e

VPS_IP="184.107.141.97"
VPS_DIR="/root/colegio-favo"

echo "=== [1/3] Sincronizando código completo do Monorepo com a VPS ==="
# Sincroniza ignorando node_modules e pastas de compilação locais
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.turbo' \
  --exclude 'build' \
  --exclude 'dist' \
  ./ root@$VPS_IP:$VPS_DIR/

echo "=== [2/3] Executando Build de todas as imagens na VPS ==="
ssh root@$VPS_IP "cd $VPS_DIR/infra/vps && docker compose build"

echo "=== [3/3] Reiniciando toda a stack de serviços na VPS ==="
ssh root@$VPS_IP "cd $VPS_DIR/infra/vps && docker compose up -d"

echo "=== [4/4] Executando Caddy reload e atualizações de configurações ==="
ssh root@$VPS_IP "docker cp $VPS_DIR/prisma.config.ts vps-backend-1:/app/prisma.config.ts || true"
ssh root@$VPS_IP "cd $VPS_DIR/infra/vps && docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile || docker compose restart caddy"

echo "=== [5/5] Sincronizando schema do Banco de Dados e Rodando Seeding ==="
ssh root@$VPS_IP "docker exec -i vps-backend-1 pnpm exec prisma db push --accept-data-loss"
ssh root@$VPS_IP "docker exec -i vps-backend-1 pnpm exec prisma db seed || true"

echo "=== [OK] Deploy da Stack Completa escolafavodemel concluído com sucesso! ==="

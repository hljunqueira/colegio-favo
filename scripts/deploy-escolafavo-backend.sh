#!/bin/bash
set -e

VPS_IP="184.107.141.97"
VPS_DIR="/root/colegio-favo"

echo "=== [1/3] Sincronizando código do Backend e Pacotes com a VPS ==="
# Sincroniza ignorando node_modules e pastas de compilação locais
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.turbo' \
  --exclude 'build' \
  --exclude 'dist' \
  ./ root@$VPS_IP:$VPS_DIR/

echo "=== [2/3] Executando Build da imagem Docker do Backend na VPS ==="
ssh root@$VPS_IP "cd $VPS_DIR/infra/vps && docker compose build backend"

echo "=== [3/4] Reiniciando container do Backend (Sem Downtime) ==="
ssh root@$VPS_IP "cd $VPS_DIR/infra/vps && docker compose up -d --no-deps backend"

echo "=== [4/4] Copiando prisma.config.ts e executando Prisma db push na VPS ==="
ssh root@$VPS_IP "docker cp $VPS_DIR/prisma.config.ts vps-backend-1:/app/prisma.config.ts || true"
ssh root@$VPS_IP "docker exec -i vps-backend-1 pnpm exec prisma db push --accept-data-loss"

echo "=== [OK] Deploy do Backend escolafavodemel concluído com sucesso! ==="

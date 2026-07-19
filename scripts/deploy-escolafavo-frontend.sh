#!/bin/bash
set -e

VPS_IP="184.107.141.97"
VPS_DIR="/root/colegio-favo"

echo "=== [1/3] Sincronizando código do Frontend com a VPS ==="
# Sincroniza ignorando node_modules e pastas de compilação locais
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.turbo' \
  --exclude 'build' \
  --exclude 'dist' \
  ./ root@$VPS_IP:$VPS_DIR/

echo "=== [2/3] Executando Build da imagem Docker do Frontend na VPS ==="
ssh root@$VPS_IP "cd $VPS_DIR && docker compose -f infra/vps/docker-compose.yml build app"

echo "=== [3/3] Reiniciando container do Frontend (Sem Downtime) ==="
ssh root@$VPS_IP "cd $VPS_DIR && docker compose -f infra/vps/docker-compose.yml up -d --no-deps app"

echo "=== [OK] Deploy do Frontend escolafavodemel concluído com sucesso! ==="

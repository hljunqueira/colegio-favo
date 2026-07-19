$VPS_IP = "184.107.141.97"
$VPS_DIR = "/root/colegio-favo"

Write-Host "=== [1/6] Compactando monorepo completo para deploy ==="
tar.exe --exclude=node_modules --exclude=.git --exclude=.turbo --exclude=build --exclude=dist -czf app.tar.gz apps packages infra prisma package.json pnpm-workspace.yaml pnpm-lock.yaml .env prisma.config.ts

Write-Host "=== [2/6] Enviando arquivo compactado para a VPS ==="
scp -o StrictHostKeyChecking=no app.tar.gz "root@${VPS_IP}:/root/colegio-favo.tar.gz"

Write-Host "=== [3/6] Extraindo arquivos na VPS ==="
ssh root@$VPS_IP "mkdir -p $VPS_DIR && tar -xzf /root/colegio-favo.tar.gz -C $VPS_DIR && rm -f /root/colegio-favo.tar.gz"

Write-Host "=== [4/6] Executando Build e iniciando stack na VPS ==="
ssh root@$VPS_IP "cd $VPS_DIR/infra/vps && docker compose build && docker compose up -d"

Write-Host "=== [5/6] Executando Caddy reload na VPS ==="
ssh root@$VPS_IP "cd $VPS_DIR/infra/vps && docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile"

Write-Host "=== [6/6] Copiando prisma.config.ts e executando db push/seed na VPS ==="
ssh root@$VPS_IP "docker cp $VPS_DIR/prisma.config.ts vps-backend-1:/app/prisma.config.ts"
ssh root@$VPS_IP "docker exec vps-backend-1 pnpm exec prisma db push --accept-data-loss"
ssh root@$VPS_IP "docker exec vps-backend-1 pnpm exec prisma db seed"

Write-Host "=== Limpando arquivos locais ==="
Remove-Item app.tar.gz -ErrorAction SilentlyContinue

Write-Host "=== [OK] Deploy da Stack Completa escolafavodemel concluído com sucesso! ==="

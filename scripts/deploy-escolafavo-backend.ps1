$VPS_IP = "184.107.141.97"
$VPS_DIR = "/root/colegio-favo"

Write-Host "=== [1/5] Compactando monorepo para deploy ==="
tar.exe --exclude=node_modules --exclude=.git --exclude=.turbo --exclude=build --exclude=dist -czf app.tar.gz apps packages infra prisma package.json pnpm-workspace.yaml pnpm-lock.yaml .env prisma.config.ts

Write-Host "=== [2/5] Enviando arquivo compactado para a VPS ==="
scp -o StrictHostKeyChecking=no app.tar.gz "root@${VPS_IP}:/root/colegio-favo.tar.gz"

Write-Host "=== [3/5] Extraindo arquivos na VPS ==="
ssh root@$VPS_IP "mkdir -p $VPS_DIR && tar -xzf /root/colegio-favo.tar.gz -C $VPS_DIR && rm -f /root/colegio-favo.tar.gz"

Write-Host "=== [4/5] Executando Build e iniciando container do Backend na VPS ==="
ssh root@$VPS_IP "cd $VPS_DIR/infra/vps && docker compose build backend && docker compose up -d --no-deps backend"

Write-Host "=== [5/5] Copiando prisma.config.ts e executando db push na VPS ==="
ssh root@$VPS_IP "docker cp $VPS_DIR/prisma.config.ts vps-backend-1:/app/prisma.config.ts"
ssh root@$VPS_IP "docker exec vps-backend-1 pnpm exec prisma db push --accept-data-loss"

Write-Host "=== Limpando arquivos locais ==="
Remove-Item app.tar.gz -ErrorAction SilentlyContinue

Write-Host "=== [OK] Deploy do Backend escolafavodemel concluído com sucesso! ==="

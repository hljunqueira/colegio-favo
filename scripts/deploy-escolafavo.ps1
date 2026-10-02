$ErrorActionPreference = "Stop"

$VPS_IP = "23.80.89.116"
$VPS_DIR = "/root/colegio-favo"

Write-Host "=== [1/4] Compactando projeto para deploy na VPS ($VPS_IP)... ===" -ForegroundColor Cyan
if (Test-Path "colegio-favo.tar.gz") {
    Remove-Item "colegio-favo.tar.gz" -Force
}

tar --exclude="node_modules" --exclude=".git" --exclude=".turbo" --exclude="build" --exclude="dist" -czf colegio-favo.tar.gz .

Write-Host "=== [2/4] Enviando pacote para a VPS via SCP... ===" -ForegroundColor Cyan
ssh root@$VPS_IP "mkdir -p $VPS_DIR"
scp colegio-favo.tar.gz root@${VPS_IP}:${VPS_DIR}/colegio-favo.tar.gz

Write-Host "=== [3/4] Extraindo arquivos na VPS... ===" -ForegroundColor Cyan
ssh root@$VPS_IP "cd $VPS_DIR && tar -xzf colegio-favo.tar.gz && rm -f colegio-favo.tar.gz"

Write-Host "=== [4/4] Executando Build e Subindo os Containers (Backend + Web)... ===" -ForegroundColor Cyan
ssh root@$VPS_IP "cd $VPS_DIR/infra/vps && docker compose -f app-compose.yml up -d --build"

Remove-Item "colegio-favo.tar.gz" -Force -ErrorAction SilentlyContinue

Write-Host "=== [SUCESSO] Deploy do Backend (porta 3031) e Web Frontend (porta 3030) concluído! ===" -ForegroundColor Green

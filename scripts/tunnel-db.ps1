# Script para abrir o túnel SSH com o PostgreSQL da VPS do Colégio Favo
Write-Host "Iniciando túnel SSH para PostgreSQL da VPS (23.80.89.116:5436 -> localhost:5432)..." -ForegroundColor Cyan
Write-Host "Mantenha este terminal aberto enquanto estiver desenvolvendo localmente." -ForegroundColor Yellow
ssh -N -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -L 5432:127.0.0.1:5436 root@23.80.89.116

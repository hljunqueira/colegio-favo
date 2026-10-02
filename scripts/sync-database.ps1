$ErrorActionPreference = "Stop"

Write-Host "1. Gerando Prisma Client..." -ForegroundColor Cyan
pnpm exec prisma generate

Write-Host "2. Iniciando túnel SSH para 23.80.89.116:5436..." -ForegroundColor Cyan
$tunnelProcess = Start-Process -FilePath "ssh" -ArgumentList "-N -o ServerAliveInterval=15 -o ExitOnForwardFailure=yes -L 5432:127.0.0.1:5436 root@23.80.89.116" -PassThru

try {
    Start-Sleep -Seconds 3
    Write-Host "3. Executando Prisma db push..." -ForegroundColor Cyan
    pnpm exec prisma db push --accept-data-loss

    Write-Host "4. Executando Prisma seed..." -ForegroundColor Cyan
    pnpm exec tsx prisma/seed.ts
    Write-Host "SUCESSO: Banco de dados sincronizado e semeado com sucesso!" -ForegroundColor Green
} finally {
    if ($tunnelProcess -and !$tunnelProcess.HasExited) {
        Write-Host "Encerrando processo do túnel SSH..." -ForegroundColor Gray
        Stop-Process -Id $tunnelProcess.Id -Force -ErrorAction SilentlyContinue
    }
}

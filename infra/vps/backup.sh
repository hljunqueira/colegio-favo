#!/bin/bash
set -e

BACKUP_DIR="/root/colegio-favo/database/backups"
mkdir -p "$BACKUP_DIR"

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/favo_db_$DATE.sql.gz"

echo "=== [$(date)] Iniciando Backup do PostgreSQL 16 (favo-postgres-16) ==="
docker exec favo-postgres-16 pg_dump -U postgres postgres | gzip > "$BACKUP_FILE"

FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "=== Backup concluído com sucesso: $BACKUP_FILE ($FILE_SIZE) ==="

# Manter histórico dos últimos 7 dias
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -delete
echo "=== Limpeza de backups antigos (> 7 dias) concluída ==="

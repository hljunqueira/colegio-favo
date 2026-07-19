#!/bin/bash
set -e

echo "=========================================================================="
# Diretrizes para deploy da aplicação mobile baseada em Expo
echo " Para realizar o deploy do aplicativo mobile (Expo):"
echo " 1. Certifique-se de configurar as credenciais no eas.json"
echo " 2. Para buildar localmente ou remotamente (EAS Build):"
echo "    pnpm --filter @colegio-favo/mobile build"
echo "    ou"
echo "    eas build --platform android --profile production"
echo " 3. Para atualizar via OTA (Over-the-Air Update sem precisar de novo app):"
echo "    eas update --branch production --message 'Atualização escolar Favo'"
echo "=========================================================================="

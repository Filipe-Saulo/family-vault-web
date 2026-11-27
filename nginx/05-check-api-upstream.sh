#!/bin/sh
# Roda antes do envsubst dos templates: sem a URL da API o nginx subiria com "${API_UPSTREAM}" literal na config
set -e
if [ -z "${API_UPSTREAM:-}" ]; then
    echo "API_UPSTREAM ausente: defina a URL da API (ex.: https://family-vault-api.<ambiente>.eastus2.azurecontainerapps.io)" >&2
    exit 1
fi
# Só esquema e host: com barra ou caminho no fim, o proxy_pass trocaria o prefixo /api/ e a API receberia /x no lugar de /api/x
case "$API_UPSTREAM" in
    http://*/* | https://*/*)
        echo "API_UPSTREAM deve ser só esquema e host, sem barra nem caminho no fim (recebido: $API_UPSTREAM)" >&2
        exit 1
        ;;
    http://* | https://*) ;;
    *)
        echo "API_UPSTREAM deve começar com http:// ou https:// (recebido: $API_UPSTREAM)" >&2
        exit 1
        ;;
esac

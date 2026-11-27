# Painel: build do Vite servido por nginx sem root, que repassa /api/* para a API (variável API_UPSTREAM).

FROM node:22-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Valores de build explícitos: o .env do repositório é de dev e fica fora da imagem (.dockerignore)
ENV VITE_API_URL=/api \
    VITE_BASE_PATH_NAME=/
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine AS final
# O entrypoint da imagem roda os scripts de /docker-entrypoint.d e aplica o envsubst em /etc/nginx/templates
COPY --chmod=755 nginx/05-check-api-upstream.sh /docker-entrypoint.d/05-check-api-upstream.sh
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /src/dist /usr/share/nginx/html
EXPOSE 8080
# Usuário nginx (UID 101), já padrão nesta imagem
USER 101

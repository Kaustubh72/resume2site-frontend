# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
# Use --legacy-peer-deps to avoid build-time peer dependency resolution errors
# (keeps Docker builds stable when package-lock.json is not present)
RUN npm install --legacy-peer-deps --silent

# Build
COPY . .
RUN npm run build -- --output-path=dist

# Production image
FROM nginx:stable-alpine
# Angular's build output lives under /app/dist/<project-name> (here: `browser`).
# Copy that folder's contents into nginx webroot so the app index replaces the
# default nginx welcome page.
COPY --from=build /app/dist/browser/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Step 1: Build the application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Accept the build-time variable and expose it to the Vite build step.
# Without this, VITE_API_BASE_URL never reaches `npm run build` — Easypanel's
# "Environment Variables" panel only injects into the running container,
# not this build stage.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Step 2: Serve the production build with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Replaces nginx's default config (which has no idea /confirm is a valid
# client-side route) with one that falls back to index.html for any path
# that isn't a real file — this is what fixes the 404 on direct page loads
# to React Router routes.
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
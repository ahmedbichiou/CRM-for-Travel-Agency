
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install --save-dev @types/lodash
COPY . .
RUN npm run build
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
RUN npm install --production
CMD ["npm", "start"]

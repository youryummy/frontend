# Install dependencies only when needed
FROM node:16.13.0-alpine3.14 AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

# Rebuild the source code only when needed
FROM node:16.13.0-alpine3.14 AS builder

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules


ENV NEXT_PUBLIC_SCOPE PUBLIC_SCOPE_TEMP
ENV NEXT_PUBLIC_CLIENT_ID CLIENT_ID_TEMP
ENV NEXT_PUBLIC_CLIENT_SECRET CLIENT_SECRET_TEMP
ENV NEXT_PUBLIC_REDIRECT_URI REDIRECT_URI_TEMP

RUN npm run build

# Production image, copy all the files and run next
FROM node:16.13.0-alpine3.14 AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh

EXPOSE 3000

RUN npx next telemetry disable

RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]

CMD npm start
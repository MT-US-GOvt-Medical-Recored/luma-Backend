# FROM node:20-alpine AS build

# WORKDIR /app

# COPY package*.json ./

# RUN npm install --legacy-peer-deps

# COPY . .

# RUN npm run migration:run

# RUN npm run build

# FROM node:20-alpine

# WORKDIR /pm

# COPY package.json ./package.json
# COPY --from=build /app/node_modules ./node_modules
# COPY --from=build /app/dist ./dist
# RUN mkdir -p logs && touch logs/access.log
# RUN chmod -R 777 logs

# COPY .env ./

# EXPOSE 5001

# CMD ["npm", "run", "start:staging"]
# === Build Stage ===
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Copy env for migration
COPY .env .env

# Run migrations with ts-node
RUN npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli -d src/database/data-source.ts migration:run

# Now compile TypeScript into dist/
RUN npm run build

# === Runtime Stage ===
FROM node:20-alpine

WORKDIR /pm

# Copy necessary files
COPY package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/.env .env

# Prepare logs folder
RUN mkdir -p logs && touch logs/access.log && chmod -R 777 logs

EXPOSE 5001

CMD ["npm", "run", "start:staging"]

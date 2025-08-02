# Use Node LTS
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 5001
CMD ["npm", "run", "start:dev"]
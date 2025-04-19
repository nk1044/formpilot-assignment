# Stage 1: Build
FROM node:slim AS builder

WORKDIR /app


COPY package*.json ./
COPY prisma ./prisma

RUN npm install


RUN npx prisma generate


COPY tsconfig.json ./
COPY src ./src

EXPOSE 8002

# Start the app
CMD ["npm", "run", "start"]

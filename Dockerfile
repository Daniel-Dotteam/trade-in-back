FROM node:18-slim

WORKDIR /app

# Install OpenSSL and other required dependencies
RUN apt-get update && apt-get install -y openssl libssl-dev

COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies)
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Clean up dev dependencies
RUN npm prune --production

EXPOSE 3000

CMD [ "npm", "start" ] 
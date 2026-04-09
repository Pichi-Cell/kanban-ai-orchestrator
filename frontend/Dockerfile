FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Run Vite dev server exposed to all interfaces so Docker port mapping works
CMD ["npm", "run", "dev", "--", "--host"]

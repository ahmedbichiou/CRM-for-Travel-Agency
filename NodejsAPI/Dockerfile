FROM node:20
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN apt-get update && apt-get install -y python3 python3-pip
EXPOSE 5000
CMD ["node", "server.js"]

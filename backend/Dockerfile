FROM node:18
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend .
COPY . .
# CMD ["node", "server.js"]
EXPOSE 5000
CMD ["npm", "start"]

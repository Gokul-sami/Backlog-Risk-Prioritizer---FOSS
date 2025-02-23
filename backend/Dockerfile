FROM node:18
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server .
COPY . .
# CMD ["node", "server.js"]
EXPOSE 5000
CMD ["npm", "start"]

FROM node:20-slim
WORKDIR /app
COPY server/package.json ./
COPY server/index.js ./
COPY server/analyzer.js ./
RUN npm install --production
EXPOSE 8080
CMD ["node", "index.js"]

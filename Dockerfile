FROM node:22-alpine
WORKDIR /app
COPY ./package.json ./
COPY .env ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
